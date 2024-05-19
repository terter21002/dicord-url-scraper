import { Module } from '@nestjs/common';
import { UrlScrapperService } from './url-scrapper.service';

@Module({
  providers: [UrlScrapperService],
})
export class UrlScrapperModule {}
