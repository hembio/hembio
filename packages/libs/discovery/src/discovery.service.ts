import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import mDNS from "multicast-dns";

interface ServiceEntry {
  name: string;
  target: string;
  port: string;
}

@Injectable()
export class DiscoveryService {
  private internalIp: string;
  private port: number;
  private mdns: mDNS.MulticastDNS;
  private readonly services = new Map<string, ServiceEntry>();

  public constructor(private readonly configService: ConfigService) {
    this.mdns = mDNS({
      interface: configService.get("internalIpv4"),
      loopback: false,
      reuseAddr: true,
    });
    this.port = configService.get<number>("port") as number;
    this.internalIp = configService.get<string>("internalIpv4") as string;

    this.mdns.on("query", (query) => {
      if (query?.questions[0]?.name == "hembio.local") {
        this.mdns.respond({
          answers: [
            {
              name: this.configService.get("serviceName") || "hembio.local",
              type: "SRV",
              data: {
                port: this.port,
                target: this.configService.get<string>(
                  "internalIpv4",
                ) as string,
              },
            },
          ],
        });
      }
    });

    this.mdns.on("response", (response) => {
      for (const answer of response.answers) {
        if (answer.name.startsWith("hembio.")) {
          this.services.set(answer.name, answer.data as any);
        }
      }
    });
  }

  public async discover(service: string): Promise<void> {
    // todo: implement
  }
}
