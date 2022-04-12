import puppeteer from 'puppeteer';
const Ipad = puppeteer.devices['iPad Pro 11 landscape'];

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    // const response = await page.goto(req.query.link, { waitUntil: 'load' });
    
    await page.emulate(Ipad);
    await page.goto('https://www.stradivarius.com/tr/en/new-collection/clothing/shop-by-product/dresses/view-all/knit-halterneck-jumpsuit-c1020132510p312119983.html?colorId=001&style=3', { waitUntil: 'load' });
    await page.screenshot({path: `./screenshots/${Date.now()}.jpg`});
    await browser.close();
  })();