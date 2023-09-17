//const puppeteer = require('puppeteer');
//const init = require('./init.js');
//const login = require('./login.js');
//const eventPage = require("./eventPage");


import  * as init  from "./init.js";
import  * as login  from "./login.js";
import  * as eventPage from "./eventPage.js";


(async () => {

    let [page,browser] = await init.initPuppeteer();

    let isLogin = await login.loginToFacebook(page)
    if(isLogin){
        //console.log(await page.content());
        await eventPage.getEvents(page)
    }





})();