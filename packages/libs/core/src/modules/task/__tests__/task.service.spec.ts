import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Test, TestingModule } from "@nestjs/testing";
import { TaskService } from "../task.service";
import { TaskEntity } from "~/entities/TaskEntity";
import MikroORMConfig from "~/mikro-orm.config";

describe("TaskService", () => {
  let tasks: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot(MikroORMConfig),
        MikroOrmModule.forFeature([TaskEntity]),
      ],
      providers: [TaskService],
    }).compile();

    tasks = module.get<TaskService>(TaskService);
  });

  it("should be defined", () => {
    expect(tasks).toBeDefined();
  });
});
