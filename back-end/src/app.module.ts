import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { buildSchema } from "type-graphql";
import { resolvers } from "../prisma/generated/type-graphql";
import { resolve } from "path";
// Ce module est importer directement car j'ai utiliser le cli de nest
import { GraphQLModule } from '@nestjs/graphql';
// Import de config Apollo
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphqltoprismaModule } from './graphqltoprisma/graphqltoprisma.module';

import {
  User,
  Todo,
  UserRelationsResolver,
  TodoRelationsResolver,
  UserCrudResolver,
  TodoCrudResolver,
} from "../prisma/generated/type-graphql";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: "/",
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true
    }),
    GraphqltoprismaModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserRelationsResolver,
    TodoRelationsResolver,
    UserCrudResolver,
    TodoCrudResolver,],
})
export class AppModule {}
