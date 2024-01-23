import { Module } from '@nestjs/common';
import { ApolloDriver } from '@nestjs/apollo';
import { PrismaClient } from '@prisma/client';
import { resolve } from 'path';
import { TypeGraphQLModule } from "typegraphql-nestjs";
import { ConfigModule } from '@nestjs/config';
import { KafkaPubSub } from 'graphql-kafka-subscriptions';
// import généré pour la package typegraphql-prisma dans le prisma.schema
import {
  UserRelationsResolver,
  TodoRelationsResolver,
  UserCrudResolver,
  TodoCrudResolver,
} from "../prisma/generated/type-graphql";

interface Context {
  prisma: PrismaClient;
}

// Connecteur kafka
export const pubSub = new KafkaPubSub({
  topic: process.env.KAFKA_TOPIC || 'tododb',
  host: process.env.KAFKA_HOST || 'localhost',
  port: process.env.KAFKA_PORT || '29092',
  globalConfig: {} // options passed directly to the consumer and producer
})



@Module({
  imports: [
    // use the TypeGraphQLModule to expose Prisma by GraphQL
    TypeGraphQLModule.forRoot({
      driver: ApolloDriver,
      path: "/",
      // le schema ira dans le fichier présent dans le outdir du tsconfig
      emitSchemaFile: resolve(__dirname, "./generated-schema.graphql"),
      validate: false,
      // connection avec prisma
      context: (): Context => ( { prisma: new PrismaClient() }),
      pubSub: pubSub,
      // globalMiddlewares: [PublishNotification],
      
    }),
    ConfigModule.forRoot({
      envFilePath: '.development.env',
    })
  ],
  providers: [
    // register all resolvers inside `providers` of the Nest module
    UserRelationsResolver,
    UserCrudResolver,
    TodoRelationsResolver,
    TodoCrudResolver,
  ],
})
export class AppModule {
  constructor() {
    pubSub.subscribe('pubSubChannel', this.onMessage)
  }
  onMessage() {
    console.log("pubSub Message:")
  }
}
