import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// Ce module est importer directement car j'ai utiliser le cli de nest
import { GraphQLModule } from '@nestjs/graphql';
// Import de config Apollo
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphqltoprismaModule } from './graphqltoprisma/graphqltoprisma.module';


@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
    }),
    GraphqltoprismaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
