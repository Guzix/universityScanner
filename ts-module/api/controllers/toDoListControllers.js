'use strict';

const puppeteer = require('puppeteer');
const fs = require('fs/promises');

async function getPrize(){
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const page = await browser.newPage();

    const url = 'https://www.skiinfo.pl/malopolskie/bialka-tatrzanska/warunki-narciarskie';

    await page.goto(url);

    const cookieAcceptBtn = await page.$('#onetrust-accept-btn-handler');

    await cookieAcceptBtn.click();

    // await page.waitForSelector('#__next > div.container > div.styles_layout__2aTIJ.pt-4 > section > article:nth-child(2) > div > div.styles_box__3xo2X > div.styles_info__3F7Vv > div > h2');
    
    const names = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("#__next > div.container > div.styles_layout__2aTIJ.pt-4 > section > article:nth-child(2) > div > div.styles_box__3xo2X > div.styles_info__3F7Vv > div > h2")).map(x => x.textContent)
    })

    await fs.writeFile("names.txt", names.join("\r\n"));

    const result = await page.$$eval('.styles_header__2KhvH', rows => {
        console.log(rows);
        return rows;
    })

    console.log(result)

    await browser.close();
    return result
}



exports.test = function(){
    getPrize();
}