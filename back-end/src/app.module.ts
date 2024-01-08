import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// Ce module est importer directement car j'ai utiliser le cli de nest
import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [GraphqlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
