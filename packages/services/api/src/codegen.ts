/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
import { writeFile } from "fs/promises";
import path from "path";
import { generate } from "@graphql-codegen/cli";
import { NestFactory } from "@nestjs/core";
import {
  GraphQLSchemaBuilderModule,
  GraphQLSchemaFactory,
} from "@nestjs/graphql";
import { printSchema } from "graphql";
import requireGlob from "require-glob";

const schemaFile = path.join(__dirname, "../generated/schema.graphql");
const reactHooksFile = path.join(
  __dirname,
  "../../../apps/web/src/generated/graphql.tsx",
);

// console.log("schemaFile:", schemaFile);
// console.log("reactHooksFile", reactHooksFile);

async function generateSchema(): Promise<string> {
  const app = await NestFactory.createApplicationContext(
    GraphQLSchemaBuilderModule,
  );
  await app.init();

  const resolvers = await requireGlob("./**/*.resolver.ts", {
    reducer: (
      options: any,
      result: any,
      fileObject: any,
      i: any,
      fileObjects: any,
    ) => {
      if (Object.values(result).length === 0) {
        result = [];
      }
      const exports = fileObjects
        .map((cur: any) => Object.values(cur.exports))
        .flat();
      return [...result, ...exports];
    },
  });

  const scalars = await requireGlob("./**/*.scalar.ts", {
    reducer: (
      options: any,
      result: any,
      fileObject: any,
      i: any,
      fileObjects: any,
    ) => {
      if (Object.values(result).length === 0) {
        result = [];
      }
      const exports = fileObjects
        .map((cur: any) => Object.values(cur.exports))
        .flat();
      return [...result, ...exports];
    },
  });

  const gqlSchemaFactory = app.get(GraphQLSchemaFactory);
  const schema = await gqlSchemaFactory.create(resolvers, scalars);
  return printSchema(schema);
}

async function main(): Promise<void> {
  const schema = await generateSchema();

  const schemaGenHeader = `# ------------------------------------------------------
# THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
# ------------------------------------------------------

`;

  await writeFile(schemaFile, schemaGenHeader + schema);

  const header = `
/***********************************************
 * !!!       THIS FILE IS GENERATED        !!! *
 * !!! DO NOT MODIFY THIS FILE BY YOURSELF !!! *
 ***********************************************/
/* eslint-disable */`;
  await generate(
    {
      schema: schemaFile,
      documents: "./src/**/*.graphql",
      generates: {
        [reactHooksFile]: {
          plugins: [
            "add",
            "typescript",
            "typescript-operations",
            "typescript-react-apollo",
          ],
        },
      },
      config: {
        content: header.trim(),
        withHooks: true,
        withRefetchFn: true,
        withResultType: true,
      },
    },
    true,
  );
  process.exit(0);
}

main();
