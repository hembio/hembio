import { IncomingMessage, ServerResponse } from "http";
import {
  createSecureServer,
  Http2ServerRequest,
  Http2ServerResponse,
} from "http2";
import { Socket } from "net";
import path from "path";
import { getCwd, getEnv, getPki } from "@hembio/core";
import { createLogger } from "@hembio/logger";
import finalhandler from "finalhandler";
import proxy from "http2-proxy";
import internalIp from "internal-ip";
import { HEMBIO_BANNER } from "./constants";
import { ensureHost } from "./ensureHost";
import { monkeyPatchTls } from "./monkeyPatchTls";

const logger = createLogger("server");

const defaultWebHandler = (
  err: Error | null,
  req: IncomingMessage,
  res: ServerResponse,
) => {
  if (err) {
    req.statusCode = 503;
    logger.error(err, "Proxy error");
    finalhandler(req, res)(err);
    return;
  }
};

const defaultWSHandler = (
  err: Error | null,
  req: IncomingMessage,
  socket: Socket,
  _head: Buffer,
) => {
  if (err) {
    logger.error(err, "Proxy error");
    socket.destroy();
  }
};

async function bootstrap() {
  const env = getEnv();
  const domain = env.HEMBIO_SERVER_DOMAIN || "hembio.local";
  const ip = env.HEMBIO_SERVER_IP || (await internalIp.v4()) || "127.0.0.1";
  const port = Number(env.HEMBIO_SERVER_PORT) || 443;

  // Output the awesome banner :D
  console.log(HEMBIO_BANNER);

  // Make sure the specified domain is in the hosts file
  logger.debug("Ensure domain is in hosts file");
  try {
    await ensureHost(domain, ip);
  } catch (e) {
    // Ignore
  }

  // Get key/cert for domain (will generate one if it doesn't already exist)
  logger.debug("Get/generate self-signed key/cert for domain");
  const [key, cert] = await getPki(domain, ip);

  // Add self-signed cert to node to prevent errors
  const selfSignedCert = path.join(getCwd(), "./pki/hembio.local/cert.pem");
  logger.debug(`Monkey patch TLS to allow our self-signed cert`);
  monkeyPatchTls(selfSignedCert);

  // https://nodejs.org/api/http2.html#http2_alpn_negotiation
  function onRequest(req: Http2ServerRequest, res: Http2ServerResponse) {
    // Detects if it is a HTTPS request or HTTP/2
    const {
      socket: { alpnProtocol },
    }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any = req.httpVersion === "2.0" ? req.stream.session : req;
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        alpnProtocol,
        httpVersion: req.httpVersion,
      }),
    );
  }

  logger.debug("Creating HTTP2 server");
  const server = createSecureServer(
    {
      key,
      cert,
      allowHTTP1: true,
    } /* onRequest */,
  );

  server.on("sessionError", () => {
    // eslint-disable-next-line prefer-rest-params
    logger.error(arguments);
  });

  server.on("request", (req: IncomingMessage, res: ServerResponse) => {
    try {
      // logger.debug(`${req.method} ${req.url}`);
      if (req.url?.startsWith("/api")) {
        proxy.web(
          req,
          res,
          {
            hostname: "hembio.local",
            port: 4000,
            protocol: "https",
            path: req.url.substr(4),
          },
          defaultWebHandler,
        );
        return;
      }

      // TODO: Report this as a bug since it's according to docs
      // Probably related: https://github.com/nxtedition/node-http2-proxy/issues/52
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const onRes: any = (
        req: IncomingMessage,
        res: ServerResponse,
        proxyRes: IncomingMessage,
      ) => {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
        // https://content-security-policy.com/unsafe-inline/
        res.setHeader(
          "Content-Security-Policy",
          [
            "default-src 'self' hembio.local",
            "frame-src 'self' 'unsafe-inline' hembio.local file:",
            // "frame-ancestors 'self' 'unsafe-inline' hembio.local file:",
            "img-src 'self' data:",
            "media-src 'self' 'unsafe-inline' hembio.local",
            "script-src 'self' 'unsafe-inline' hembio.local",
            "style-src 'self' 'unsafe-inline' hembio.local",
            "style-src-elem 'self' 'unsafe-inline' hembio.local fonts.googleapis.com",
            "font-src 'self' fonts.gstatic.com",
          ].join("; "),
        );
        // https://developer.chrome.com/blog/enabling-shared-array-buffer/
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
        proxyRes.pipe(res);
      };

      proxy.web(
        req,
        res,
        {
          hostname: "localhost",
          port: 3000,
          onRes,
        },
        defaultWebHandler,
      );
    } catch (e) {
      logger.error(e);
      res.end();
    }
    defaultWebHandler(null, req, res);
  });

  server.on("upgrade", (req: IncomingMessage, socket: Socket, head: Buffer) => {
    if (req.url?.startsWith("/api")) {
      proxy.ws(
        req,
        socket,
        head,
        {
          hostname: "hembio.local",
          port: 4000,
          protocol: "https",
          path: req.url.substr(4),
        },
        defaultWSHandler,
      );
      return;
    }
    if (req.url?.startsWith("/sockjs-node")) {
      proxy.ws(
        req,
        socket,
        head,
        {
          hostname: "localhost",
          port: 3000,
        },
        defaultWSHandler,
      );
      return;
    }
    defaultWSHandler(null, req, socket, head);
  });

  server.listen(port, domain, () => {
    logger.info(`Listening on https://${domain}:${port}`);
  });
}

process.on("uncaughtException", (e) => {
  logger.error(e);
});

try {
  bootstrap();
} catch (e) {
  console.error(e);
  logger.error(e);
}
