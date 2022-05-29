import express from 'express'
import puppeteer from 'puppeteer-extra';
import * as cheerio from 'cheerio';
import cors from 'cors';
import ScrapManager from './ScrapManager.js';
import dotenv from 'dotenv';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const app = express();

dotenv.config('./.env');

app.use(cors({
    origin: '*'
}));
puppeteer.use(StealthPlugin());

// const Ipad = puppeteer.devices['iPad Pro 11 landscape'];

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', async (req, res) => {
    const browser  = process.env.APP_MODE == "production" ? 
        await puppeteer.launch({ 
            headless: true,
            executablePath: process.env.CHROMIUM_PATH,
            // args: [ '--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote' ],
     })
     : await puppeteer.launch({  
        headless: true,
        // args: [ '--disable-gpu', '--no-sandbox',]
    });

    const page = await browser.newPage();
    // await page.emulate(Ipad);
    page.setExtraHTTPHeaders({
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9,en;q=0.8'
    })
    page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36');

    const response = await page.goto(req.query.link, { waitUntil: 'load'});
    // await page.screenshot({ path: './screenshot.png' });

    const $ = cheerio.load(await response.text());
    const data = ScrapManager(req.query.link, $);

    await browser.close();
    console.log(response.json())
    res.send({ 'content': data });
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))