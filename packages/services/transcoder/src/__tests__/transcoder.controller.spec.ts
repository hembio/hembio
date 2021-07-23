import { Test, TestingModule } from "@nestjs/testing";
import { TranscoderController } from "../transcoder.controller";

describe("TranscoderController", () => {
  let controller: TranscoderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranscoderController],
    }).compile();

    controller = module.get<TranscoderController>(TranscoderController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
