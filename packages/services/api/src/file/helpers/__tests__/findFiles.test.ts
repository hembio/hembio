import "ts-morph";
import path from "path";
import { FileEntity, MikroORMConfig } from "@hembio/core";
import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";

async function createORM(): Promise<MikroORM<IDatabaseDriver<Connection>>> {
  return await MikroORM.init({
    debug: false,
    ...MikroORMConfig,
    dbName: path.join(__dirname, "test.sqlite"),
    baseDir: __dirname,
  });
}

describe("findFiles", () => {
  it("should find by id", async () => {
    expect.assertions(1);
    const orm = await createORM();
    const fileRepo = orm.em.getRepository(FileEntity);
    const file = await fileRepo.findOne("60372a92-f449-5084-a14d-5a426bb243d4");
    expect(file?.id).toBe("60372a92-f449-5084-a14d-5a426bb243d4");
  });

  it.skip("should find by title", async () => {
    // TODO: Fix test
    expect.assertions(3);
    // const orm = await createORM();
    // const files = await findFiles(orm.em, {
    //   titleId: "ae46449a-5343-5c42-9af5-c0afbf90c000",
    // });
    // expect(files?.length).toBe(2);
    // expect(files[0].id).toBe("60372a92-f449-5084-a14d-5a426bb243d4");
    // expect(files[1].id).toBe("010fd6b6-f6ad-536a-85ee-9fc0e2041c9e");
  });
});
