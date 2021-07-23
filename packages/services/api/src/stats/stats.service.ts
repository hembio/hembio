import os from "os";
import { Injectable } from "@nestjs/common";
import { StatsModel } from "./models/stats.model";

function arrAvgSum(arr: number[]): number {
  if (arr && arr.length >= 1) {
    const sumArr = arr.reduce((a, b) => a + b, 0);
    return sumArr / arr.length;
  }
  return 0;
}

@Injectable()
export class StatsService {
  public getCurrentCpuAverages(): { idle: number; total: number } {
    let totalIdle = 0;
    let totalTick = 0;
    const cpus = os.cpus();

    // Loop through cores
    for (const cpu of cpus) {
      // Add ticks for each core
      totalTick += Object.values(cpu.times).reduce((acc, cur) => acc + cur, 0);
      // Add idle time for eac core
      totalIdle += cpu.times.idle;
    }

    // Return the average idle and tick times
    return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
  }

  public async getCurrentCpuLoad(avgTime = 1000, delay = 100): Promise<number> {
    return new Promise((resolve, reject) => {
      const n = ~~(avgTime / delay);
      if (n <= 1) {
        reject(new Error("Interval is too small"));
      }

      let i = 0;
      const samples: number[] = [];
      const avg1 = this.getCurrentCpuAverages();
      const interval = setInterval(() => {
        if (i >= n) {
          clearInterval(interval);
          resolve(~~(arrAvgSum(samples) * 100));
        }
        const avg2 = this.getCurrentCpuAverages();
        const totalDiff = avg2.total - avg1.total;
        const idleDiff = avg2.idle - avg1.idle;
        samples[i] = 1 - idleDiff / totalDiff;
        i++;
      }, delay);
    });
  }

  public async getStats(): Promise<StatsModel> {
    return {
      time: Math.floor(Date.now() / 1000),
      uptime: os.uptime(),
      cpuUsage: await this.getCurrentCpuLoad(),
      totalMem: Math.floor(os.totalmem() / 1000),
      freeMem: Math.floor(os.freemem() / 1000),
    };
  }
}
