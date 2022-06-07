import { createReadStream, createWriteStream, existsSync } from "fs";
import {
  unlink,
  rmdir,
  stat,
  mkdir,
  readFile,
  appendFile,
  readdir,
  rename,
} from "fs/promises";
import { homedir } from "os";
import { dirname, join } from "path";
import commandExists from "command-exists";
import execa, { ExecaError } from "execa";
import Powershell from "node-powershell";
import { parseCertificate } from "sshpk";
import tempWrite from "temp-write";
import { file as tmpFile } from "tmp-promise";
import { shellEscape } from "~/utils/shellEscape";

const userHome = homedir();

const CERT_EXPIRE_DAYS = "365";

function getCSRConfig(commonName: string): string {
  // https://github.com/openssl/openssl/blob/master/apps/openssl.cnf
  return `
[req]
prompt = no
default_md = sha256
distinguished_name = req_distinguished_name

[ req_distinguished_name ]
C = US
ST = NY
L = Local
O = Local Organization
OU = Local Organizational Unit
CN = ${commonName}
`;
}

function getExtConfig(subjectAltNames: string[]): string {
  return `
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = ${subjectAltNames.join(",")}
`;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    const stats = await stat(path);
    return stats.isFile();
  } catch (err) {
    return false;
  }
}

async function directoryExists(path: string): Promise<boolean> {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch (err) {
    return false;
  }
}

async function keychainGetDefault(): Promise<string> {
  const command = "security default-keychain";
  try {
    const { stdout: keychain } = await execa(command);
    return keychain.trim().replace(/^"(.+)"$/, "$1");
  } catch (error) {
    const e = error as ExecaError;
    throw e.stdout ? new Error(e.stdout) : error;
  }
}

async function keychainAddTrusted(
  keychain: string,
  cert: string,
): Promise<void> {
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
    const e = error as ExecaError;
    const message =
      (e.stdout && e.stdout) || (e.stderr && e.stderr.split("\n")[1]) || "";
    throw message ? new Error(message) : error;
  }
}

async function nssVerifyDb(): Promise<boolean> {
  const db = join(userHome, ".pki", "nssdb");
  return directoryExists(db);
}

async function nssVerifyCertUtil(): Promise<void> {
  if (!(await commandExists("certutil"))) {
    throw new Error("certutil not found");
  }
}

async function generateSelfSignedCerts(
  caKey: string,
  caCert: string,
  key: string,
  cert: string,
  commonName: string,
  subjectAltNames: string[],
  algorithm = "ED25519",
) {
  const isWindows = process.platform === "win32";
  const openSSLBin = "openssl" + (isWindows ? ".exe" : "");

  const csrConfigFile = await tempWrite(getCSRConfig(commonName));
  const extConfigFile = await tempWrite(getExtConfig(subjectAltNames));

  const env = { OPENSSL_CONF: csrConfigFile };

  const caKeyFile = existsSync(caKey)
    ? (await readFile(caKey)).toString()
    : await tempWrite(
        (
          await execa(openSSLBin, ["genpkey", "-algorithm", algorithm], { env })
        ).stdout,
      );
  const clientKeyFile = existsSync(key)
    ? (await readFile(key)).toString()
    : await tempWrite(
        (
          await execa(openSSLBin, ["genpkey", "-algorithm", algorithm], { env })
        ).stdout,
      );

  const caCertFile = await tmpFile();
  if (existsSync(caCert)) {
    createReadStream(caCert).pipe(createWriteStream(caCertFile.path));
  } else {
    await execa(openSSLBin, [
      "req",
      "-x509",
      "-new",
      "-key",
      caKeyFile,
      "-sha256",
      "-days",
      CERT_EXPIRE_DAYS,
      "-subj",
      "/C=US/O=Local Root Organization/OU=Local Root Organizational Unit/CN=Local Root",
      "-out",
      caCertFile.path,
    ]);
  }

  const csr = await tmpFile();
  const csrArgs = [
    "req",
    "-new",
    "-out",
    csr.path,
    "-key",
    clientKeyFile,
    "-config",
    csrConfigFile,
  ];
  await execa(openSSLBin, csrArgs);

  try {
    const signArgs: readonly string[] = [
      "x509",
      "-req",
      "-in",
      csr.path,
      "-CA",
      caCertFile.path,
      "-CAkey",
      caKeyFile,
      "-CAcreateserial",
      "-days",
      CERT_EXPIRE_DAYS,
      "-sha256",
      "-extfile",
      extConfigFile,
      "-out",
      isWindows ? cert : shellEscape([cert]),
    ];
    await execa(openSSLBin, signArgs);
    console.debug(`Moving ${clientKeyFile} => ${key}`);
    await rename(clientKeyFile, key);
    console.debug(`Moving ${caKeyFile} => ${caKey}`);
    await rename(caKeyFile, caKey);
    console.debug(`Moving ${caCertFile.path} => ${caCert}`);
    await rename(caCertFile.path, caCert);
  } catch (e) {
    const error = e as ExecaError;
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
    await caCertFile.cleanup();
    await unlink(clientKeyFile);
    await unlink(caKeyFile);
    throw error;
  } finally {
    try {
      await Promise.all([
        csr.cleanup(),
        unlink(csrConfigFile),
        unlink(csrConfigFile),
      ]);
    } catch {
      // Ignore
    }
  }
}

async function certUtilAddStore(cert: string): Promise<void> {
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

async function nssAddCertificate(cert: string): Promise<void> {
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

async function firefoxAddCertificate(
  cert: string,
  commonName: string,
): Promise<void> {
  const { platform } = process;
  let firefoxProfiles;
  if (platform === "linux") {
    firefoxProfiles = join(userHome, ".mozilla/firefox");
  } else if (platform === "darwin") {
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
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    if (e.code === "ENOENT") {
      return;
    } else {
      throw e;
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
    const { platform } = process;
    if (platform === "linux") {
      certUtil = "certutil";
    } else if (platform === "darwin") {
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
    } catch (err) {
      const e = err as ExecaError;
      if (!/SEC_ERROR_BAD_DATABASE/.test(e.stderr)) {
        console.warn(e.stderr);
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
    const issuer = Buffer.from(certificate.issuer.toString());
    const serialLength = Buffer.alloc(4);
    serialLength.writeIntBE(serial.length, 0, serial.length);
    const issuerLength = Buffer.alloc(4);
    issuerLength.writeIntBE(issuer.length, 0, serial.length);
    const dbKey = Buffer.concat([
      Buffer.alloc(4),
      Buffer.alloc(4),
      serialLength,
      issuerLength,
      new TextEncoder().encode(serial.toString()),
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

const defaultCaKey = join(process.cwd(), "caKey.pem");
const defaultCaCert = join(process.cwd(), "caCert.pem");
const defaultKey = join(process.cwd(), "key.pem");
const defaultCert = join(process.cwd(), "cert.pem");
const defaultCommonName = "localhost";
const defaultSubjectAltName = [
  "DNS:localhost",
  "DNS:*.localhost",
  "DNS:localhost.localdomain",
  "IP:127.0.0.1",
  "IP:0.0.0.0",
  "IP:::1",
  "IP:::",
];

export { defaultKey, defaultCert, defaultCommonName, defaultSubjectAltName };

interface KeygenOptions {
  caKey?: string;
  caCert?: string;
  key?: string;
  cert?: string;
  commonName?: string;
  subjectAltNames?: string[];
  entrust?: boolean;
}

export async function keygen({
  caKey = defaultCaKey,
  caCert = defaultCaCert,
  key = defaultKey,
  cert = defaultCert,
  commonName = defaultCommonName,
  subjectAltNames = [],
  entrust = true,
}: KeygenOptions = {}): Promise<{
  caKey: string;
  caCert: string;
  key: string;
  cert: string;
}> {
  try {
    await Promise.all([
      mkdir(dirname(caKey), { recursive: true }),
      mkdir(dirname(caCert), { recursive: true }),
      mkdir(dirname(key), { recursive: true }),
      mkdir(dirname(cert), { recursive: true }),
    ]).catch(() => {
      // Ignore any errors
    });

    await generateSelfSignedCerts(
      caKey,
      caCert,
      key,
      cert,
      commonName,
      subjectAltNames,
    );
  } catch (error) {
    try {
      await Promise.all([
        unlink(key),
        unlink(cert),
        rmdir(dirname(key)),
        rmdir(dirname(cert)),
      ]);
    } catch {
      // Ignore
    }
    throw error || new Error("Failed to set up certificate");
  }

  if (entrust === true) {
    switch (process.platform) {
      case "darwin": {
        const keychain = await keychainGetDefault();
        await keychainAddTrusted(keychain, caCert);
        await firefoxAddCertificate(caCert, commonName);
        break;
      }
      case "linux":
        if (await nssVerifyDb()) {
          await nssVerifyCertUtil();
          await nssAddCertificate(caCert);
          await firefoxAddCertificate(caCert, commonName);
        } else {
          throw new Error("Unable to locate NSS database");
        }
        break;
      case "win32":
        await certUtilAddStore(caCert);
        break;
      default:
        throw new Error(
          "Entrusting certificates on this platform is not supported.",
        );
    }
  }

  return { caKey, caCert, key, cert };
}

export async function ephemeral(
  options: KeygenOptions,
): Promise<{ caKey: Buffer; caCert: Buffer; key: Buffer; cert: Buffer }> {
  const [caKeyFile, caCertFile, keyFile, certFile] = await Promise.all([
    await tmpFile(),
    await tmpFile(),
    await tmpFile(),
    await tmpFile(),
  ]);
  const paths = await keygen(
    Object.assign({}, options, {
      caKey: caKeyFile.path,
      caCert: caCertFile.path,
      key: keyFile.path,
      cert: certFile.path,
    }),
  );
  const [caKey, caCert, key, cert] = await Promise.all([
    readFile(paths.caKey),
    readFile(paths.caCert),
    readFile(paths.key),
    readFile(paths.cert),
  ]);
  await Promise.all([
    caKeyFile.cleanup(),
    caCertFile.cleanup(),
    keyFile.cleanup(),
    certFile.cleanup(),
  ]);
  return { caKey, caCert, key, cert };
}
