import stradivarius from "./scrapers/stradivarius.js";
import zara from "./scrapers/zara.js";

export default function (link, cheerio) {
    const scrapers = {
        'stradivarius.com': stradivarius,
        'zara.com': zara
    }
    // look for hostname
    const url = new URL(link);
    const hostname = url.hostname.replace(/www./i, '');
    if(!scrapers.hasOwnProperty(hostname)) {
        return console.log(`don't have scrapers for ${link}`);
    }
    const scraper = scrapers[hostname];
    
    return scraper(cheerio);
}