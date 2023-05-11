import Parser from "rss-parser";
import { IRssFeedItem } from "../models/interfaces/IRssFeedItem";

class RssService {
    rssParser: any;
    constructor() {
        this.rssParser = new Parser();
    }

    async parseURL(facultyURL: string): Promise<IRssFeedItem[]>  {
       try {
        const feed = await this.rssParser.parseURL(facultyURL)
        console.log('My feed: ', JSON.stringify(feed.items[0]));
        return feed?.items;
       }
       catch(err) {
        console.log("Error: RssService.parseURL is failed. ", err);
       }
       return [];
    }
}

export default RssService;