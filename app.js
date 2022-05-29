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
     })
     : await puppeteer.launch({  
        headless: true,
    });

    const page = await browser.newPage();

    const response = await page.goto(req.query.link, { waitUntil: 'load'});
    // await page.screenshot({ path: './screenshot.png' });
    await page.waitForTimeout(2000)
    const $ = cheerio.load(await response.text());
    const data = ScrapManager(req.query.link, $);
    console.log(JSON.stringify(await response.text()));
    await browser.close();
    res.send({ 'content': data });
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))