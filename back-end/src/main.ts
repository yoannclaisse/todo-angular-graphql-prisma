import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KafkaPubSub } from 'graphql-kafka-subscriptions';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  // activation des CORS, pour eviter d'avoir un erreur côté frontend
  app.enableCors();
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
