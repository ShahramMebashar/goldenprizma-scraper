const stradivarius = require("./scrapers/stradivarius.js");
const zara = require("./scrapers/zara.js");

module.exports = function (link, cheerio) {
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