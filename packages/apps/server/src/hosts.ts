import * as hostile from "hostile";

export async function hasHost(domain: string, ip: string): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    hostile.get(false, (err, res) => {
      if (!err && Array.isArray(res)) {
        for (const [entryIp, entryDomain] of res) {
          if (entryIp === ip && entryDomain === domain) {
            return resolve(true);
          }
        }
      }
      resolve(false);
    });
  });
}

export async function setHost(host: string, ip: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    hostile.set(ip, host, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
