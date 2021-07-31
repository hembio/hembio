import { Test, TestingModule } from "@nestjs/testing";
import { CreditResolver } from "../credit.resolver";

describe("CreditResolver", () => {
  let resolver: CreditResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreditResolver],
    }).compile();

    resolver = module.get<CreditResolver>(CreditResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
