import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlScrapperModule } from './url-scrapper/url-scrapper.module';

@Module({
  imports: [UrlScrapperModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
