import { Test, TestingModule } from "@nestjs/testing";
import { TitleResolver } from "../title.resolver";

describe("TitlesResolver", () => {
  let resolver: TitleResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TitleResolver],
    }).compile();

    resolver = module.get<TitleResolver>(TitleResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
