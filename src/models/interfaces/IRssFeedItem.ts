export interface IRssFeedItem {
    creator: string;
    title: string;
    link: string;
    "content:encoded": string;
    "content:encodedSnippet": string;
    content: string;
    contentSnippet: string;
    guid: string;
    categories: string[];
    isoDate: string;
}