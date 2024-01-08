import { NestFactory } from '@nestjs/core';
import { buildSchema } from "type-graphql";
import { AppModule } from './app.module';
import { resolvers } from "../prisma/generated/type-graphql";
import { resolve } from "path";

async function bootstrap() {
  const schema = await buildSchema({
    resolvers,
    emitSchemaFile: resolve(__dirname, "./schema.gql"),
    validate: false,
  });
  console.log(schema)
  const app = await NestFactory.create(AppModule);
  // Enable cors
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
