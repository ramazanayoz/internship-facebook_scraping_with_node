//const puppeteer = require('puppeteer');
//const init = require('./init.js');
//const login = require('./login.js');
//const eventPage = require("./eventPage");

import *  as helpers from "./helpers.js";

//https://www.browserstack.com/guide/puppeteer-type-command


import  * as init  from "./init.js";
import  * as login  from "./login.js";
import  * as eventPage from "./eventPage.js";

let page = "";
let browser = "";

import puppeteer from "puppeteer";
//import {betweenRandomNum, selector_click_puppeteer, timeout} from "./helpers.js";

async function run() {

    await searchInGoogle();
    await page.waitForNavigation();
    //let googleElements = await collectUrls();

    //let collectUrlsHandle = await collectUrls();
    let googleEls = [];

    await page.evaluate( (googleEls) => {
        //return await new Promise(resolve => {
        let aElements =  document.querySelectorAll(' a[href], a[ping], a[jsname], a[data-ved]');
        for (let i = 0; i < aElements.length; i++) {
            let sElement = aElements[i];
            if (!sElement.href.includes('google') && sElement.href.includes('http') && sElement.outerHTML.includes("h3")) {
                console.log(sElement.href);
                googleEls.push(sElement);
            }
        }
        // return googleEls;

        //});
        //});
    },googleEls);

    //collectUrlsHandle = helpers.shuffleArray(await collectUrlsHandle);
    for (let i = 0; i < 1; i++) {
            await helpers.click_puppeteer(page ,collectUrlsHandle[i]);
            await page.evaluate(async (collectUrlsHandle,i) => {
            await collectUrlsHandle[i].click();
                //await page.goBack();
            }, collectUrlsHandle,i);
        await page.waitForNavigation({waitUntil:'load'});

        await tourWebSite();
             /*
                //await collectUrlsHandle[i].click();
                //await page.waitForNavigation({waitUntil:'networkidle2'});
            });
        //page.waitForNavigation({waitUntil: 'DOMContentLoaded'});
        await tourWebSite();

              */
    }
}


let searchInGoogle = async () => {

    return await new Promise(async (resolve, reject) => {
        try {
            //const browser = await puppeteer.launch();
            //const page = await browser.newPage();
            [page, browser] = await init.initPuppeteer();
            await page.goto("https://google.com");
            /*
            await helpers.selector_click_puppeteer(page,'document.getElementsByTagName("textarea")[0]');
            */
            /*
             */
            let urls = await page.evaluate(async () => {
                let results = [];
                let item = await document.getElementsByTagName("textarea")[0];
                if (item) {
                    await item.click();
                }
            });
            await page.keyboard.type("Hello");
            await page.keyboard.press('Enter');

            // Wait for navigation to complete
            //await page.waitForNavigation();
            return resolve();
            //return resolve(await page.waitForNavigation({waitUntil: 'load'}));
            //return resolve("urls");
        } catch (e) {
            return reject(e);
        }
    });
};

let collectUrls = (async () => {

});

let tourWebSite = async function () {
    let timeout1000 = helpers.timeout(1000);
    let random1_5 = helpers.betweenRandomNum(1,5);
    //await page.evaluate(async (timeout1000, random1_5) => {
        for (let i = 0; i < 7; i++) {
            /*
            if (window.screen.height < window.innerHeight) {
                break;
            }


             */
            let randomScroll = [200, 400, 630, 720, 800, 900, 1000];

            await page.evaluate(function () {
                return window.scrollBy(Number(window.screen.height), 500);
            });
            //await timeout1000;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    //},timeout1000, random1_5);
};





run().then(console.log).catch(console.error);
