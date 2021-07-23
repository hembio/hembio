import { Query, Resolver } from "@nestjs/graphql";
import { StatsModel } from "./models/stats.model";
import { StatsService } from "./stats.service";

@Resolver(() => StatsModel)
export class StatsResolver {
  public constructor(private readonly statsService: StatsService) {}

  @Query(() => StatsModel, { name: "stats" })
  public async getStats(): Promise<StatsModel> {
    const stats = await this.statsService.getStats();
    console.log(stats);
    return stats;
  }
}
