import { existsSync } from "fs";
import { readFile } from "fs/promises";
import path from "path";
import { keygen } from "~/lib/tlsKeyGen";
import { getCwd } from "~/utils/getCwd";

interface ReadCertProps {
  key: string;
  cert: string;
  domain?: string;
  ip?: string;
}

async function readCert({
  key,
  cert,
  domain = "localhost",
  ip = "127.0.0.1",
}: ReadCertProps): Promise<[string, string]> {
  if (!existsSync(key) || !existsSync(cert)) {
    await keygen({
      key,
      cert,
      commonName: domain,
      subjectAltNames: domain
        ? [`DNS:${domain}`, `DNS:*.${domain}`, `IP:${ip}`]
        : [],
    });
  }
  return Promise.all([
    (await readFile(key)).toString(),
    (await readFile(cert)).toString(),
  ]);
}

export async function getPki(
  domain = "localhost",
  ip = "127.0.0.1",
): Promise<[string, string]> {
  const certBasePath = path.join(getCwd(), "./pki/", domain);
  const pki = {
    cert: path.join(certBasePath, "cert.pem"),
    key: path.join(certBasePath, "key.pem"),
  };
  return readCert({ ...pki, domain, ip });
}
