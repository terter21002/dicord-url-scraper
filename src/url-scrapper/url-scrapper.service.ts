import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';

// Define interfaces
interface Collection {
  id: number;
  bannerUrl: string;
  thumbnailUrl: string;
  slug: string;
  name: string;
  description: string;
  verification: {
    asalytics: boolean;
  };
  socials: {
    type: string;
    value: string;
  }[];
}

interface Item {
  id: number;
  volume: string;
  dayVolumeDiff: string;
  dayVolume: string;
  weekVolumeDiff: string;
  weekVolume: string;
  monthVolumeDiff: string;
  monthVolume: string;
  assetCount: number;
  floorPrice: string;
  highestSale: string;
  listedPercent: number;
  listedCount: number;
  collection: Collection;
}

interface ApiResponse {
  page: number;
  perPage: number;
  total: number;
  items: Item[];
}

@Injectable()
export class UrlScrapperService implements OnApplicationBootstrap {
  //   constructor() {}

  onApplicationBootstrap() {
    console.log('Crawler start!');
    // urls = const this.crawlDiscordUrls()
    // this.csvConvert(urls);
    this.scrapeUrlFromSite1();
    this.scrapeUrlFromSite2();
  }

  private async scrapeUrlFromSite1() {
    let currentPage = 0;
    const allDiscordUrls: string[] = [];

    try {
      while (true) {
        const config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: `https://api.exa.market/v1/collectionRanking?sort=weekVolume&perPage=500&page=${currentPage}`,
          headers: {
            Origin: 'https://exa.market',
          },
        };

        const response = await axios.request(config);
        const jsonData: ApiResponse = response.data;
        console.log(`Fetched page ${currentPage + 1}`);

        const discordUrls = this.extractDiscordUrls(jsonData);
        allDiscordUrls.push(...discordUrls);

        // If there are no more items, break the loop
        if (jsonData.items.length === 0) {
          break;
        }

        currentPage++;
      }

      // Save all Discord URLs to CSV
      this.saveToCsv(allDiscordUrls, 'site1_discord_urls.csv');
    } catch (error) {
      console.log(error);
      // Handle errors
    }
  }

  private extractDiscordUrls(data: ApiResponse): string[] {
    const discordUrls: string[] = [];

    data.items.forEach((item) => {
      item.collection.socials.forEach((social) => {
        if (social.type === 'discord' && social.value) {
          const url = social.value;
          const lastPathParam = url.split('/')[4];
          const inviteWord = url.split('/')[3];

          if (
            (url.includes('discord') &&
              lastPathParam &&
              inviteWord === 'invite' &&
              lastPathParam.length !== 10) ||
            (url.includes('discord.gg') &&
              inviteWord &&
              inviteWord.length !== 10)
          )
            discordUrls.push(social.value);
        }
      });
    });

    return discordUrls;
  }

  private saveToCsv(data: string[], filename: string): void {
    const csvData = data.map((url) => `${url}`).join('\n');
    fs.writeFileSync(filename, csvData);
    console.log(`Saved Discord URLs to ${filename}`);
  }

  private async scrapeUrlFromSite2() {
    console.log('ddd');
  }
}
