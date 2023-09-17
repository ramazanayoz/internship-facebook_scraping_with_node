//const puppeteer = require("puppeteer");

import puppeteer from "puppeteer-core";


export {initPuppeteer};
async function initPuppeteer(initialURL:any){
    const browser = await puppeteer.launch(
	{
        headless:false,
        args: ['--remote-debugging-port=8889'],
        channel: 'chrome',
        devtools: true}	//debug
    );

   // const url = 'https:/www.facebook.com'

    // Create a new page with the default browser context

    let [page] =  await browser.pages();


    await Promise.all([
        page.waitForNavigation({waitUntil: 'networkidle0'}),
        page.goto(initialURL),
    ]);

    return [page,browser];
}