import fs from "fs";
import tls from "tls";

const origCreateSecureContext = tls.createSecureContext;

export function monkeyPatchTls(cert: string): void {
  tls.createSecureContext = (options) => {
    const context = origCreateSecureContext(options);

    const pem = fs
      .readFileSync(cert, { encoding: "ascii" })
      .replace(/\r\n/g, "\n");

    const certs = pem.match(
      /-----BEGIN CERTIFICATE-----\n[\s\S]+?\n-----END CERTIFICATE-----/g,
    );

    if (!certs) {
      throw new Error(`Could not parse certificate ${cert}`);
    }

    certs.forEach((cert) => {
      context.context.addCACert(cert.trim());
    });

    return context;
  };
}
