import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { TopicsModule } from './topics/topics.module';
import { ContentsModule } from './contents/contents.module';

@Module({
  imports: [UsersModule, CategoriesModule, TopicsModule, ContentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
