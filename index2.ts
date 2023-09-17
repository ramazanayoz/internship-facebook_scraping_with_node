
import *  as helpers from "./helpers";

//https://www.browserstack.com/guide/puppeteer-type-command


import  * as init  from "./init";

let page : any;
let browser : any;


async function helpers_waiting(element:any){
    await page.exposeFunction("helpers_waiting", waiting);
}



async function run() {


    [page, browser] = await init.initPuppeteer("https://www.google.com");

    await helpers_timeout(1000);

    /////////////////search in google
    await helpers_pupClick("textarea");

    /*
    let button = await page.evaluateHandle(() =>
        document.getElementsByTagName("textarea")[0]
    );

    await Promise.all([
        button.asElement().click()
    ]);
    */
    await Promise.allSettled([
        await page.keyboard.type("Hello"),
        await page.keyboard.press('Enter'),
    ]);

    await page.waitForNavigation({waitUntil: 'networkidle2'});
    await surfWebsites(page);
}

async function surfWebsites(page : any) {
    ///click to links and surf the pages
    let googEl: any[];
    await Promise.allSettled([
        googEl = await test() ||[]
    ]);




    let result3 = await Promise.allSettled(googEl.map(async (t) => {
        //return await t.evaluateHandle((x:any) => x.textContent);

        let elements : any[];
        await t.evaluate(async (element:any,page: { exposeFunction: (arg0: string, arg1: Promise<void>) => any; }) => {
            //await page.waitForSelector(".logo"),
            await element.click();
            //await page.waitForNavigation()
            //await helpers_waiting(element);
            await helpers_waiting(element);
            //await page.exposeFunction("waiting", waiting(element));

        //    await scrollInPage(x)
           // await x.goBack(),
           // await x.waitForSelector(".logo")
        },page);

    }))

   
    console.log({result3 : result3});
}


async function scrollInPage(element:any) {
        //await page.waitForNavigation();

        await page.evaluateHandle(async () => {
        for (let i = 0; i < 7; i++) {

            if (window.screen.height < window.innerHeight) {
                break;
            }
            let randomScroll = [200, 400, 630, 720, 800, 900, 1000];

            //await new Promise(resolve => setTimeout(resolve, 1000));

            await helpers_timeout(1000);

            window.scrollBy(Number(window.screen.height), 500);


        }
        //},timeout1000, random1_5);
    })
}


    //collect urls




    //let googleElements = await collectUrls();

    //let collectUrlsHandle = await collectUrls();


    //collectUrlsHandle = helpers.shuffleArray(await collectUrlsHandle);



let searchInGoogle = async () => {

    return await new Promise(async (resolve, reject) => {
        try {
            //const browser = await puppeteer.launch();
            //const page = await browser.newPage();
            [page, browser] = await init.initPuppeteer("https://google.com");
            //await page.goto("https://google.com");
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
            //return resolve(await page.waitForNavigation({waitUntil: 'load'}));
            //return resolve("urls");
        } catch (e) {
            return reject(e);
        }
    });
};

let collectUrls = (async () => {

});

/*
let tourWebSite = async function () {
    let timeout1000 = helpers.timeout(1000);
    let random1_5 = helpers.betweenRandomNum(1,5);
    //await page.evaluate(async (timeout1000, random1_5) => {
        for (let i = 0; i < 7; i++) {
            /
            if (window.screen.height < window.innerHeight) {
                break;
            }


             /
            let randomScroll = [200, 400, 630, 720, 800, 900, 1000];

            await page.evaluate(function () {
                return window.scrollBy(Number(window.screen.height), 500);
            });
            //await timeout1000;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    //},timeout1000, random1_5);
};

*/


async function getSelectorElements_Pup(selectorPath : any, page :any) {


    return async function trying() {
        return await page.evaluate(() =>
                document.querySelector("a")
            //await document.querySelectorAll(' a[href], a[ping], a[jsname], a[data-ved]')
        );
    };
}


async function s2s(selectorPath:any, page:any) {
    return await page.evaluate((selectorPath:any) => {
        //console.log("x+++++" + x);
        return document.querySelector(selectorPath);
    },selectorPath);
}


/*helpers--------------*/

async function pupClick(selector:any) {
    /*
    let button = await page.evaluateHandle((selector) =>
        document.getElementsByTagName(selector)[0],selector
    );

    await Promise.all([
        button.asElement().click(),
    ]);
    */
    await page.$eval(selector, (elem: HTMLElement) => (elem as HTMLElement).click());

}


async function waiting(element: any){
    
    await Promise.allSettled([
        await page.waitForSelector(".logo"),
        await scrollInPage(element),
        await page.goBack(),
        await page.waitForSelector(".logo")
    ]);
}


async function pupClickHandleElement(handleElement:any) {
    //await handleElement[0].click();
    //await page.waitForNavigation;
    await Promise.allSettled([
    await handleElement[0].evaluate(async (domElement:any) => {
        await helpers_pupClick(domElement);
        // etc ...
    })
    ]);
    /*
    await Promise.allSettled([

         c       
        handleElement.asElement().click(),

        //page.waitForNavigation(),
    ]);
    */
}


function generateRandomNum(min :any, max:any) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}




async function wait(ms :any) {
    await new Promise(resolve => setTimeout(resolve, ms));
}


async function helpers_timeout(ms:any){
    await page.exposeFunction("helpers_timeout", helpers.timeout);
}


async function helpers_pupClick(domElement:any){
    await page.exposeFunction("helpers_pupClick", pupClick);
}

async function helpers_pupClickHandleElement(handleElement:any){
    await page.exposeFunction("pupClickHandleElement", pupClickHandleElement);
}

async function test(){
    const linksElements = await page.$$("a");
    let googleElements:any[] = [] || [];
    console.log(googleElements);
    for (let i = 0; i < linksElements.length; i++) {
    const text = await linksElements[i].getProperty('href');
    let href = await text.jsonValue();
    const text2 = await linksElements[i].getProperty('outerHTML');
    let outerHTML = await text2.jsonValue();
    if (href && !href.includes('google') && href.includes('http') && outerHTML && outerHTML.includes("h3")) {
        googleElements.push(linksElements[i]);
    }

}
return googleElements;
}

run().then(console.log).catch(console.error);