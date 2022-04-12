import express from 'express'
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import cors from 'cors';
import ScrapManager from './ScrapManager.js';

const app = express();

app.use(cors({
    origin: '*'
}));

const Ipad = puppeteer.devices['iPad Pro 11 landscape'];

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', async (req, res) => {
    const browser  = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.emulate(Ipad);
    const response = await page.goto(req.query.link, { waitUntil: 'load'});
    const $ = cheerio.load(await response.text());
    const data = ScrapManager(req.query.link, $);
    console.log(data);
    res.send({ 'content': data });
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))