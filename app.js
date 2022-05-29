import express from 'express'
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import cors from 'cors';
import ScrapManager from './ScrapManager.js';
import dotenv from 'dotenv';
import fs from 'fs';

const app = express();

dotenv.config('./.env');

app.use(cors({
    origin: '*'
}));

const Ipad = puppeteer.devices['iPad Pro 11 landscape'];

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', async (req, res) => {
    const browser  = process.env.APP_MODE == "production" ? 
        await puppeteer.launch({ 
            // headless: true,
            executablePath: process.env.CHROMIUM_PATH,
            args: [ '--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote' ],
     })
     : await puppeteer.launch({ args: ['--no-sandbox'] });

    const page = await browser.newPage();
    await page.emulate(Ipad);
     
    const response = await page.goto(req.query.link, { waitUntil: 'load'});
    // await page.screenshot({ path: './screenshot.png' });
    const stream = fs.createWriteStream('./result.html');
    stream.once('open', async function () {
        stream.end(await response.text());
    })
    const $ = cheerio.load(await response.text());
    const data = ScrapManager(req.query.link, $);

    await browser.close();
    res.send({ 'content': data });
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))