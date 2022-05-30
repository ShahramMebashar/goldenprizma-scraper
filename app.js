const express = require('express');
const puppeteer = require('puppeteer-extra');
const cheerio = require('cheerio');
const cors = require('cors');
const ScrapManager = require('./ScrapManager.js');
const dotenv = require('dotenv');
const stealth = require('puppeteer-extra-plugin-stealth');

const app = express();

dotenv.config('./.env');

app.use(cors({
    origin: '*'
}));
puppeteer.use(stealth());

// const Ipad = puppeteer.devices['iPad Pro 11 landscape'];

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', async (req, res) => {
    const browser  = process.env.APP_MODE == "production" ? 
        await puppeteer.launch({ 
            headless: true,
            executablePath: process.env.CHROMIUM_PATH,
            ignoreHTTPSErrors: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-sync",
                "--ignore-certificate-errors",
                "--lang=en-US,en;q=0.9",
            ],
     })
     : await puppeteer.launch({  
        headless: false,
    });

    const page = await browser.newPage();

    const response = await page.goto(req.query.link, { waitUntil: 'load'});
    await page.screenshot({ path: './screenshot.png' });

    const $ = cheerio.load(await response.text());
    const data = ScrapManager(req.query.link, $);

    await browser.close();
    res.send({ 'content': data });
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))