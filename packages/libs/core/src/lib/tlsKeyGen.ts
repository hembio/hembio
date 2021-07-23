import { spawnSync } from "child_process";
import {
  unlink,
  rmdir,
  stat,
  mkdir,
  readFile,
  writeFile,
  appendFile,
  readdir,
} from "fs/promises";
import { homedir, platform } from "os";
import { dirname, join } from "path";
import commandExists from "command-exists";
import execa from "execa";
import Powershell from "node-powershell";
import { parseCertificate } from "sshpk";
import tempWrite from "temp-write";
import { file as tmpFile } from "tmp-promise";
import { shellEscape } from "~/utils/shellEscape";

const userHome = homedir();

const defaultOpenSSLConfig = `
[ req ]
#default_bits		= 2048
#default_md		= sha256
#default_keyfile 	= privkey.pem
distinguished_name	= req_distinguished_name
attributes		= req_attributes

[ req_distinguished_name ]
countryName			= Country Name (2 letter code)
countryName_min			= 2
countryName_max			= 2
stateOrProvinceName		= State or Province Name (full name)
localityName			= Locality Name (eg, city)
0.organizationName		= Organization Name (eg, company)
organizationalUnitName		= Organizational Unit Name (eg, section)
commonName			= Common Name (eg, fully qualified host name)
commonName_max			= 64
emailAddress			= Email Address
emailAddress_max		= 64

[ req_attributes ]
challengePassword		= A challenge password
challengePassword_min		= 4
challengePassword_max		= 20
`;

async function fileExists(path: string) {
  try {
    const stats = await stat(path);
    return stats.isFile();
  } catch (err) {
    return false;
  }
}

async function directoryExists(path: string) {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch (err) {
    return false;
  }
}

interface OpenSSLArgs {
  ecparam: string;
  keyout: string;
  out: string;
  commonName: string;
  config?: string;
}

function opensslArgs({
  ecparam,
  keyout,
  out,
  commonName,
  config,
}: OpenSSLArgs) {
  const args = [
    // https://wiki.openssl.org/index.php/Manual:Req(1)
    "req",

    // generates a new certificate
    "-new",

    // outputs a self signed certificate instead of a certificate request
    "-x509",

    // the number of days to certify the certificate for
    "-days",
    "365",

    // private key will not be encrypted
    "-nodes",

    // RSA is widely supported...
    // '-newkey', 'rsa:2048',

    // ... but ECC is more efficient in bandwidth/CPU/RAM.
    // The prime256v1 curve is enabled by default in Node.js.
    // The secp384r1 curve is disabled in Node 8.6+ by default.
    // Both are widely supported in browsers recommended by NIST.
    // To be replaced by x25519 soon. See: nodejs/node#1495
    "-newkey",
    `ec:${ecparam}`,

    // the message digest to sign the request with
    "-sha256",

    "-keyout",
    keyout,
    "-out",
    out,

    // origins covered by this certificate
    "-subj",
    `/CN=${commonName}`,
  ];

  if (config !== undefined) {
    args.push("-extensions", "SAN", "-reqexts", "SAN", "-config", config);
  }

  return args;
}

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function findAsync<T extends Array<any>>(
  arr: T,
  asyncCallback: (v: ArrayElement<T>) => Promise<boolean>,
) {
  const promises = arr.map(asyncCallback);
  const results = await Promise.all(promises);
  const index = results.findIndex((result) => result);
  return arr[index];
}

async function generateLocalhostPairUnix(
  key: string,
  cert: string,
  commonName: string,
  subjectAltNames: string[],
) {
  const configFiles: string[] = [
    // OPENSSL config(3)
    process.env.OPENSSL_CONF || "",
    // Ubuntu Linux & MacOS High Sierra
    "/etc/ssl/openssl.cnf",
    // MacOS El Capitan & Yosemite
    "/usr/local/etc/openssl/openssl.cnf",
    // StackOverflow hearsay
    "/etc/pki/tls/openssl.cnf",
    "/usr/local/ssl/openssl.cnf",
    "/opt/local/etc/openssl/openssl.cnf",
    "/System/Library/OpenSSL/openssl.cnf",
  ];

  const opensslCnf = await findAsync(configFiles, fileExists);
  if (opensslCnf === undefined) {
    throw new Error("OpenSSL configuration not found.");
  }

  const args = opensslArgs({
    ecparam: "<(openssl ecparam -name prime256v1)",
    keyout: shellEscape([key]),
    out: shellEscape([cert]),
    commonName,
    config: subjectAltNames
      ? `<(cat ${opensslCnf} <(printf "\\n[SAN]\\nsubjectAltName=${subjectAltNames.join(
          ",",
        )}"))`
      : undefined,
  });

  const output = spawnSync("openssl", args, { shell: "/bin/bash" });
  if (output.status !== 0) {
    const message = output.stderr.toString();
    throw new Error(message);
  }
}

async function keychainGetDefault() {
  const command = "security default-keychain";
  try {
    const { stdout: keychain } = await execa(command);
    return keychain.trim().replace(/^"(.+)"$/, "$1");
  } catch (error) {
    throw error.stdout ? new Error(error.stdout) : error;
  }
}

async function keychainAddTrusted(keychain: string, cert: string) {
  const command = shellEscape([
    "security",
    "-v",
    "add-trusted-cert",
    "-r",
    "trustRoot",
    "-p",
    "ssl",
    "-k",
    keychain,
    cert,
  ]);
  try {
    await execa(command);
  } catch (error) {
    const message =
      (error.stdout && error.stdout) ||
      (error.stderr && error.stderr.split("\n")[1]) ||
      "";
    throw message ? new Error(message) : error;
  }
}

async function nssVerifyDb() {
  const db = join(userHome, ".pki", "nssdb");
  return directoryExists(db);
}

async function nssVerifyCertUtil() {
  if (!(await commandExists("certutil"))) {
    throw new Error("certutil not found");
  }
}

async function generateLocalhostPairWindows(
  key: string,
  cert: string,
  commonName: string,
  subjectAltNames: string[],
) {
  const openSSLConf = await tmpFile();
  await writeFile(openSSLConf.path, defaultOpenSSLConfig);

  try {
    const ecparam = await tempWrite(
      (
        await execa("openssl.exe", ["ecparam", "-name", "prime256v1"], {
          env: { OPENSSL_CONF: openSSLConf.path },
        })
      ).stdout,
    );
    const cnf = await tempWrite(
      Buffer.concat([
        await readFile(openSSLConf.path),
        Buffer.from(`\n[SAN]\nsubjectAltName=${subjectAltNames.join(",")}`),
      ]),
    );
    openSSLConf.cleanup();
    const args = opensslArgs({
      ecparam,
      keyout: key,
      out: cert,
      commonName,
      config: cnf,
    });
    const env = { OPENSSL_CONF: cnf };
    await execa("openssl.exe", args, { env });
    try {
      await Promise.all([unlink(ecparam), unlink(cnf)]);
    } catch {
      // Ignore
    }
  } catch (error) {
    const nodeCommand = /Command failed:/;
    if (nodeCommand.test(error.message)) {
      error.message = error.message
        .split("\n")
        .filter((line: string) => !nodeCommand.test(line))
        .join("\n");
    }
    const isOpensslError = /:error:/;
    if (isOpensslError.test(error.message)) {
      error.message = error.message
        .split("\n")
        .filter((line: string) => isOpensslError.test(line))
        .join("\n");
    }
    throw error;
  }
}

async function certUtilAddStore(cert: string) {
  const ps = new Powershell({
    executionPolicy: "Bypass",
    verbose: false,
  });
  const command = [
    "Start-Process",
    "-FilePath",
    '"certutil.exe"',
    "-ArgumentList",
    `"-addstore -f Root \`"${cert}\`""`,
    "-Verb",
    "RunAs",
    "-WindowStyle",
    "Hidden",
    "-Wait",
  ].join(" ");
  try {
    await ps.addCommand(command);
    await ps.invoke();
  } catch (error) {
    await ps.dispose();
    throw error;
  }
  await ps.dispose();
}

// Delete:
// certutil -D -d sql:${HOME}/.pki/nssdb -n localhost

// List all:
// certutil -L -d sql:${HOME}/.pki/nssdb

async function nssAddCertificate(cert: string) {
  const db = join(userHome, ".pki", "nssdb");
  const command = shellEscape([
    "certutil",
    "-A",
    "-d",
    `sql:${db}`,
    "-n",
    "localhost",
    "-i",
    cert,
    "-t",
    "C,,",
  ]);
  await execa(command);
}

async function firefoxAddCertificate(cert: string, commonName: string) {
  const os = platform();
  let firefoxProfiles;
  if (os === "linux") {
    firefoxProfiles = join(userHome, ".mozilla/firefox");
  } else if (os === "darwin") {
    firefoxProfiles = join(
      userHome,
      "Library/Application Support/Firefox/Profiles",
    );
    // firefoxProfiles = join(userHome, 'Library/Mozilla/Firefox/Profiles')
    // } else if (os === 'win32') {
    //   firefoxProfiles = join(process.env.APPDATA, 'Mozilla\\Firefox\\Profiles')
  } else {
    return;
  }

  let profiles;
  try {
    profiles = await readdir(firefoxProfiles);
  } catch (error) {
    if (error.code === "ENOENT") {
      return;
    } else {
      throw error;
    }
  }
  const certificate = parseCertificate(await readFile(cert), "pem");
  for (const profile of profiles) {
    const directory = join(firefoxProfiles, profile);

    // The `sql` type first tries cert9.db (Firefox >=58), otherwise
    // falls back to cert8.db (Firefox <58).
    // https://wiki.mozilla.org/NSS_Shared_DB#Accessing_the_shareable_Database
    const prefix = "sql";
    const db = `${prefix}:${directory}`;

    // Documentation:
    // https://developer.mozilla.org/en-US/docs/Mozilla/Projects/NSS/Reference/NSS_tools_:_certutil
    let certUtil;
    if (os === "linux") {
      certUtil = "certutil";
    } else if (os === "darwin") {
      // Use direct path as Homebrew does not symlink the binaries by default.
      certUtil = "/usr/local/opt/nss/bin/certutil";
      if (!fileExists(certUtil)) {
        // console.warn('Missing "certutil" command. Run: brew install nss')
        return;
      }
    }

    if (!certUtil) {
      throw Error("Missing certutil");
    }

    const command = shellEscape([
      certUtil,
      "-A",
      "-d",
      db,
      "-n",
      commonName,
      "-i",
      cert,
      "-t",
      "C,,",
    ]);
    try {
      await execa(command);
    } catch (error) {
      if (!/SEC_ERROR_BAD_DATABASE/.test(error.stderr)) {
        console.warn(error.stderr);
      }
      continue;
    }

    // References:
    // - https://developer.mozilla.org/en-US/docs/Archive/Misc_top_level/Cert_override.txt
    // - http://boblord.livejournal.com/18402.html

    // SHA-256 fingerprint
    const oidSha256 = "OID.2.16.840.1.101.3.4.2.1";
    const fingerprint = certificate
      .fingerprint("sha256")
      .toString("hex")
      .toUpperCase();

    // Accept unsigned certificates
    const overrideType = "U";

    // Differs slightly from Firefox but accepted nonetheless
    // Ported from: https://github.com/Osmose/firefox-cert-override
    const { serial } = certificate;
    const issuer = Buffer.from(certificate.issuer);
    const serialLength = Buffer.alloc(4);
    serialLength.writeIntBE(serial.length, 0, serial.length);
    const issuerLength = Buffer.alloc(4);
    issuerLength.writeIntBE(issuer.length, 0, serial.length);
    const dbKey = Buffer.concat([
      Buffer.alloc(4),
      Buffer.alloc(4),
      serialLength,
      issuerLength,
      new TextEncoder().encode(serial),
      issuer,
    ]).toString("base64");

    // The file header warns against modifying, but
    // I could not find any other programmatic way to add an override.
    const psm = join(directory, "cert_override.txt");

    // Firefox exceptions are per-port. 😫 No wildcards.
    const ports = [
      // HTTP & HTTPS
      80, 443,
      // IANA http-alt
      // https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml?search=http-alt
      8008, 8080,
      // Common local development ports
      8000, 8443,
    ];

    for (const port of ports) {
      const exception = [
        `${commonName}:${port}`,
        oidSha256,
        fingerprint,
        overrideType,
        dbKey,
      ].join("\t");
      await appendFile(psm, `${exception}\n`);
    }
  }
}

const defaultKey = join(process.cwd(), "key.pem");
const defaultCert = join(process.cwd(), "cert.pem");
const defaultCommonName = "localhost";
const defaultSubjectAltNames = [
  "DNS:localhost",
  "DNS:*.localhost",
  "DNS:localhost.localdomain",
  "IP:127.0.0.1",
  "IP:0.0.0.0",
  "IP:::1",
  "IP:::",
];

export { defaultKey, defaultCert, defaultCommonName, defaultSubjectAltNames };

interface KeygenOptions {
  key?: string;
  cert?: string;
  commonName?: string;
  subjectAltNames?: string[];
  entrust?: boolean;
}

export async function keygen({
  key = defaultKey,
  cert = defaultCert,
  commonName = defaultCommonName,
  subjectAltNames = defaultSubjectAltNames,
  entrust = true,
}: KeygenOptions = {}): Promise<{ key: string; cert: string }> {
  try {
    await Promise.all([
      mkdir(dirname(key), { recursive: true }),
      mkdir(dirname(cert), { recursive: true }),
    ]);
    switch (platform()) {
      case "darwin":
      case "linux":
        await generateLocalhostPairUnix(key, cert, commonName, subjectAltNames);
        break;
      case "win32":
        await generateLocalhostPairWindows(
          key,
          cert,
          commonName,
          subjectAltNames,
        );
        break;
      default:
        throw new Error(
          "Generating certificates on this platform is not supported.",
        );
    }
  } catch (error) {
    try {
      await unlink(key);
      await unlink(cert);
      await rmdir(dirname(key));
      await rmdir(dirname(cert));
    } catch {
      // Ignore
    }
    throw error || new Error("Failed to set up certificate");
  }

  if (entrust === true) {
    switch (platform()) {
      case "darwin": {
        const keychain = await keychainGetDefault();
        await keychainAddTrusted(keychain, cert);
        await firefoxAddCertificate(cert, commonName);
        break;
      }
      case "linux":
        if (await nssVerifyDb()) {
          await nssVerifyCertUtil();
          await nssAddCertificate(cert);
          await firefoxAddCertificate(cert, commonName);
        } else {
          throw new Error("Unable to locate NSS database");
        }
        break;
      case "win32":
        await certUtilAddStore(cert);
        break;
      default:
        throw new Error(
          "Entrusting certificates on this platform is not supported.",
        );
    }
  }

  return { key, cert };
}

export async function ephemeral(
  options: KeygenOptions,
): Promise<{ key: Buffer; cert: Buffer }> {
  const [keyFile, certFile] = await Promise.all([
    await tmpFile(),
    await tmpFile(),
  ]);
  const paths = await keygen(
    Object.assign({}, options, {
      key: keyFile.path,
      cert: certFile.path,
    }),
  );
  const [key, cert] = await Promise.all([
    readFile(paths.key),
    readFile(paths.cert),
  ]);
  await Promise.all([keyFile.cleanup(), certFile.cleanup()]);
  return { key, cert };
}
