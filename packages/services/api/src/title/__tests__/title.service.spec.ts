import { MikroORMConfig, MikroOrmModule } from "@hembio/core";
import { Test, TestingModule } from "@nestjs/testing";
import { TitleService } from "../title.service";

describe("TitlesService", () => {
  let service: TitleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MikroOrmModule.forRoot(MikroORMConfig)],
      providers: [TitleService],
    }).compile();

    service = module.get<TitleService>(TitleService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findTitles", () => {
    it("should find by slug", async () => {
      expect.assertions(3);
      const title = await service.findOneBySlug("alien-1979");
      expect(title?.slug).toBe("alien-1979");
      expect(title?.name).toBe("Alien");
      expect(title?.year).toBe(1979);
    });

    it("should find all titles", async () => {
      expect.assertions(1);
      const titles = await service.findAll({});
      expect(titles?.length).toBe(23);
    });

    it("should find multiple titles by id", async () => {
      expect.assertions(3);
      const [titles] = await service.findAll({
        ids: [
          "ae46449a-5343-5c42-9af5-c0afbf90c000",
          "74604f83-6bce-5198-b333-1580dcb6a122",
        ],
        orderBy: { name: "ASC" },
      });
      expect(titles.length).toBe(2);
      expect(titles[0].slug).toBe("alien-1979");
      expect(titles[1].slug).toBe("aliens-1986");
    });

    it("should find all titles beginning with a", async () => {
      expect.assertions(5);
      const [titles] = await service.findAll({
        name: "a",
        orderBy: { name: "ASC" },
      });
      expect(titles.length).toBe(6);
      expect(titles[0].slug).toBe("alien-1979");
      expect(titles[1].slug).toBe("aliens-1986");
      expect(titles[2].slug).toBe("annabelle-comes-home-2019");
      expect(titles[3].slug).toBe("apocalypse-now-1979");
    });

    it("should find by exact year", async () => {
      expect.assertions(4);
      const [titles] = await service.findAll({ year: 1986 });
      expect(titles.length).toBe(1);
      expect(titles[0].slug).toBe("aliens-1986");
      expect(titles[0].name).toBe("Aliens");
      expect(titles[0].year).toBe(1986);
    });

    it("should find by year range", async () => {
      expect.assertions(4);
      const [titles] = await service.findAll({
        year: [1979, 1986],
        orderBy: { year: "ASC" },
      });
      expect(titles.length).toBe(3);
      expect(titles[0].slug).toBe("alien-1979");
      expect(titles[1].slug).toBe("apocalypse-now-1979");
      expect(titles[2].slug).toBe("aliens-1986");
    });
  });
});
