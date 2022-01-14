const puppeteer = require('puppeteer');
const fs = require('fs/promises');

async function getPrize(){
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const page = await browser.newPage();

    const url = 'https://wsiz.edu.pl/stud-i-stop/';

    await page.goto(url);

    // const cookieAcceptBtn = await page.$('#onetrust-accept-btn-handler');

    // await cookieAcceptBtn.click();
//*[@id="wpv-view-layout-36877"]/ul
    // await page.waitForSelector('#__next > div.container > div.styles_layout__2aTIJ.pt-4 > section > article:nth-child(2) > div > div.styles_box__3xo2X > div.styles_info__3F7Vv > div > h2');

    const names = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("#wpv-view-layout-36877 > ul > li")).map(x => x.textContent)
    })

    console.log(names)

    await fs.writeFile("values\\names.txt", names.join("\r\n"));

    const result = await page.$$eval('.styles_header__2KhvH', rows => {
        console.log(rows);
        return rows;
    })

    console.log(result)

    await browser.close();

    return JSON(result);
}

getPrize();

