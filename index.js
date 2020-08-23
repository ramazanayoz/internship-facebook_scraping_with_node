//https://dev.to/iduoad/how-to-scrape-facebook-events-for-fun-and-profit-26lo

const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const myDbService = require('./server/myDbService');
const { resolve } = require('path');
const { post } = require('request');

const db = myDbService.getDbServiceInstance();

var postData = "";
var cookie = "";

//users
var inWhichUser = 0;
var faceUserArr=[];
//faceUserArr.push({email: "eayozr2@gmail.com", password: "aa123456"});  
//faceUserArr.push({email: "eayozr5@gmail.com", password: "aa123456"});
faceUserArr.push({email: "eayoz333@gmail.com", password: "r789456123"});  
//faceUserArr.push({email: "eayozr2@gmail.com", password: "rr123456"});    

( async () => {
    
    //***** MAİN*/
    var browser;
    let page ;

    page = await initPuppeteer();


    let isLoginError = await loginToFacebook();

    if(isLoginError == false){
        await page.waitForSelector("div#contentArea").then(  async () => {
            await eventOperations();
        });
        
    }
    else{
        console.log("login gerçekleşmedi, isLoginError::",isLoginError);
    }
    //***** */
    //await browser.close();



    async function initPuppeteer(){
        const url = 'https:/www.facebook.com'
        browser = await puppeteer.launch({
            headless: false,
            args: [
                '--incognito',
                "--disable-notifications",
                '--no-sandbox',
                "--ignore-certificate-errors",
                "--proxy-server='direct://",
                "--proxy-bypass-list=*",
                "--disable-setuid-sandbox",
                '--disable-web-security',
                
                "--disable-plugins", "--disable-sync", "--disable-gpu", "--disable-speech-api",
                "--disable-remote-fonts", "--disable-shared-workers", "--disable-webgl", "--no-experiments",
                "--no-first-run", "--no-default-browser-check", "--no-wifi", "--no-pings", "--no-service-autorun",
                "--disable-databases", "--disable-default-apps", "--disable-demo-mode",
                "--disable-permissions-api", "--disable-background-networking", "--disable-3d-apis",
                "--disable-bundled-ppapi-flash"

              ],
            browserContext: "default",
        });
    
        const [page] = await browser.pages(); //incognito modda açmak istediğimiz için    
        //const page = await browser.newPage();
    
        await page.setViewport({ width: 1920, height: 1080 });
    
        //blocking images and CSS for speed up
     /*
        await page.setRequestInterception(true);

        page.on('request', (req) => {
            if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image' ){
                req.abort();
            }
            else {
                req.continue();
            }
        });
        */
        //---------------

        //await page.setUserAgent('Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:79.0) Gecko/20100101 Firefox/79.0');

        await page.goto(url);

        return page;
    }



    async function loginToFacebook(){

        //if there is error in login1 then login2 funct will work  
        var loginError = false;

        await login1().catch(err => {
            loginError = true; 
            
        } ) ;

        console.log("login1 err:: ", loginError ); 

        if(loginError){
            loginError = await login2();
            console.log("login2 err::", loginError);
        }

        return loginError;

    }

    
    //LOGİN FUNC -----------------
    async function login1() {
        
            await page.waitFor("input");
            await page.click("input[type=\"email\"]")
            await page.keyboard.type(faceUserArr[inWhichUser].email);
        
            await page.waitFor("input");
            await page.click("input[type=\"password\"]")
            await page.keyboard.type(faceUserArr[inWhichUser].password);
        
            await page.waitFor("input");
            await page.click("input[type=\"submit\"]");
        
    }//--------------------------



    //login1 olmadıysa login2 --------------
    async function login2() { 
        const isError = await new Promise(async (resolve, reject) => {
            console.log("login2 ile giriş yapılıyor")
            await page.waitFor("input[type=\"text\"]");
            await page.click("input[type=\"text\"]")
            await page.keyboard.type(faceUserArr[inWhichUser].email);
        
            await page.waitFor("input[type=\"password\"]");
            await page.click("input[type=\"password\"]")
            await page.keyboard.type(faceUserArr[inWhichUser].password);
        
            try{
                await page.waitFor("button[type=\"submit\"]");
                await page.click("button[type=\"submit\"]");
            }catch(e){

            }

            await page.waitForSelector("div#content_container", {timeout: 15000}).then( () => {
            console.log("login2 başarılı"); 
            resolve(false);
            }).catch( async (e) => {
                console.log("bir problem oluştu");
                loginError =  await page.waitForSelector("form[ajaxify=\"/checkpoint/async?next\"]", {timeout: 3000}).then(async() => {
                    console.log("güvenlik sorunu çözülüyor"); 
                    resolve(await solveSecurityProblem()); 
                }).catch((e) => {
                    console.log("solveSecurityProblem'de problem oluştu")
                    resolve(true)
                })
            });
        });
        return isError;

    }//-------------------------



    

    //login ile giriş yapılmadıysa doğrulama isteniyor--------------------
    async function solveSecurityProblem(){ 
        const isError = await new Promise(async (resolve, reject) => {
            try{
                await page.waitFor("form[ajaxify=\"/checkpoint/async?next\"]")
                await page.waitFor("button#checkpointSubmitButton");
                await page.click("button#checkpointSubmitButton");

                //doğrulama 2.adım
                await page.waitFor("input[name=\"verification_method\"]")
                await page.evaluate(() => {
                    element =  document.querySelector("input[name=\"verification_method\"]");
                    console.log(element);
                    element.click();
                    document.querySelector("button[type=\"submit\"]").click();
                });
                

                //google giriş için yeni sekme açılıyor ona geçiş yapıyoruz
                const nav = new Promise(res => browser.on('targetcreated', res))
                await page.waitFor("button[value=\"1\"]");
                await page.click("button[value=\"1\"]")
                await nav
                const pages = await browser.pages();
                console.log(pages.length);//number of pages increases !
                console.log(pages.map(page => page.url()));
                const popup = pages[pages.length-1]

                //google login işlemleri
                signInGoogle(popup);
                console.log("solveSecurtiy başarılı");
                resolve(false);
            } catch(e){
                console.log("solve security bir hata oluştu");
                await signOutForCookies();
                waitFor
                resolve(true);
            }
        });
        return isError;
    }//---------------------------------

    //doğrulama yaparken gerekli sadece-------------------------
    async function signInGoogle(popup){
        const isSuccessfull = await new Promise( async (resolve, reject) => {
            try {
                await popup.setViewport({ width: 1500, height: 764 });

                await popup.waitFor(1000);
                //first write email
                await popup.waitFor("input[type=\"email\"]", {visible:true})
                await popup.click("input[type=\"email\"]", {visible:true})
                await popup.keyboard.type("eayoz333@gmail.com");
                await popup.waitFor("div.VfPpkd-dgl2Hf-ppHlrf-sM5MNb > button", {visible:true});
                await popup.click("div.VfPpkd-dgl2Hf-ppHlrf-sM5MNb > button", {visible:true}).catch((e) => console.log(""));
        


                //then email

                await popup.waitFor("input[type=\"password\"]", {visible:true})
                await popup.click("input[type=\"password\"]", {visible:true})
                await popup.keyboard.type("rr294294294");    
                await popup.waitFor("div.VfPpkd-dgl2Hf-ppHlrf-sM5MNb > button", {visible:true})
                await popup.click("div.VfPpkd-dgl2Hf-ppHlrf-sM5MNb > button").catch((e) => console.log(""));

                await page.evaluate(`window.confirm = () => true`)
                await page.waitFor("div.dialog_buttons >  div > label > input", {visible:true});
                console.log("beklendi");
                await page.click("div.dialog_buttons >  div > label > input");
                console.log("beklendi");
                await page.waitFor(2000);
                await page.waitFor("button#checkpointSubmitButton", {visible:true})
                await page.click("button#checkpointSubmitButton");
                console.log("bitti");
                resolve(true);
            } catch(e) {
                console.log("error", e);
            }
        });
        return isSuccessfull;
    }//--------------------


    //visiting event page and scrapping events----------------
    async function eventOperations(){
        console.log("event operations working");

        //await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');


        /// work this section in server in infinitive times
        await getEventsList();
        await checkMissingPlace();

        
        console.log("totaly finished"); 
        console.log("browserClosed");
        

    }//--------------------


    async function fetchEvents(cityId){
        console.log("events fetching");
        //console.log(postData);
        
        let pagCursor = "";
        let hasNextPage = true;
        var eventsObjArr = [];

        //console.log(cityId);
        //console.log("cookie::::", cookie);
        //console.log("postdata:::",postData);

         //cityId =  109330919085413; 
        
        while(hasNextPage){

            var cityPart = postData.substring(0, postData.lastIndexOf("city%22%3A%")+13 ) + cityId;
            var cursorPart = postData.substring(postData.lastIndexOf("%22%2C%22timezone"), postData.lastIndexOf("cursor&")+6) +`=${pagCursor}`;
            var lastPart  = postData.substring( postData.lastIndexOf("&timezone"), postData.length );
            newPostData = cityPart + cursorPart + lastPart;
            //console.log("newPostData::: ", newPostData);
            //console.log("pagCursor:::: ",pagCursor);
            const axios = require('axios');
            var htmlText = await axios({
                method: 'post',
                url: encodeURI("https://www.facebook.com/events/discover/query/"),
                headers:{
                    "Host": "www.facebook.com",
                    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:79.0) Gecko/20100101 Firefox/79.0",
                    "Accept": "*/*",
                    "Accept-Language": "tr-TR,tr;q=0.8,en-US;q=0.5,en;q=0.3",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Origin": "https://www.facebook.com",
                    "Connection": "keep-alive",
                    "Cookie": cookie,
                    "TE": "Trailers",
                },
                "Referer": `https://www.facebook.com/events/discovery/?suggestion_token={"city":${cityId}}&acontext={"ref":2,"ref_dashboard_filter":"upcoming","source":2,"source_dashboard_filter":"discovery","action_history":"[{\"surface\":\"dashboard\",\"mechanism\":\"main_list\",\"extra_data\":{\"dashboard_filter\":\"upcoming\"}},{\"surface\":\"discover_filter_list\",\"mechanism\":\"surface\",\"extra_data\":{\"dashboard_filter\":\"discovery\"}},{\"surface\":\"discover_filter_list\",\"mechanism\":\"surface\",\"extra_data\":{\"dashboard_filter\":\"discovery\"}}]","has_source":true}`,

                data: newPostData,
            }).then( (res) => res.data)

            
            htmlText = await  htmlText.substring(9);
            json = await JSON.parse(htmlText);

            //console.log(json.payload.results[0]);

            try {

                var eventsArr = await json.payload.results[0].events;

                //for( i = 0; i < eventsArr.length; i++) { //kaynak prmise.all en hızlı sonra for of sonra for https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop  
                //burayı incele foreach içinde kullanmak istiyorsan daha hızllı olması için  https://stackoverflow.com/questions/48864589/how-to-scrape-multi-level-links-using-puppeteer-js
                
                // Visit each eventsList page one by one
                await Promise.all(eventsArr.map(async (event) => {
                //for (const event of eventsArr) {
                    
                //console.log(event); 
                    //var event = eventsArr[i];

                    const isExistInDB = await db.checkEventExist(event.eventId); 
                    //console.log("exist in db ", isExistInDB);
                    if(!isExistInDB){
                    
                        var eventId = event.id;
                        var eventTitle = event.title;
                        var eventDay = event.day;
                        var eventDateAndTime = event.dateAndTime;
                        var eventLocation = event.location;
                        var eventsocialContext = event.socialContext;
                        var eventDescription = event.description;
                        var eventBuyTicketUrl = event.eventBuyTicketUrl;
                        var isFreeEvent = event.isFreeEvent;
                        var isOnlineEvent = event.isOnlineOrDetectedOnline;
                        var isHappeningNowEvent = event.isHappeningNow


                        eventObj =  {
                            "eventId": eventId,
                            "cityId": cityId,
                            "eventTitle": eventTitle,
                            "eventDay": eventDay,
                            "eventDateAndTime": eventDateAndTime,
                            "eventLocation" : eventLocation,
                            "eventsocialContext": eventsocialContext,
                            "eventDescription": eventDescription,
                            "eventBuyTicketUrl": eventBuyTicketUrl,
                            "isFreeEvent": isFreeEvent,
                            "isOnlineEvent": isOnlineEvent,
                            "isHappeningNowEvent": isHappeningNowEvent
                        }

                        //await page.waitFor(100 + Math.floor(Math.random()*(999-100+1)+100) );
                        const fulleventObj = await getEventDetail(eventObj);

                        if(fulleventObj){
                            //*önlemek için aynı şeyler yazılmasın diye
                            //*kaynak https://stackoverflow.com/questions/46867517/how-to-read-file-with-async-await-properly/46867579
                            const fs = require('fs');

                            eventsObjArr.push(await fulleventObj);

                            fs.appendFile('mynewfile2cevap.txt', `${fulleventObj.eventId} \n`, function (err) {
                                if (err) throw err;
                                //console.log('Saved!');
                            });     
                        }
                    }
 
                }));
                
                //console.log(json.payload.results[0].events);
        
                pagCursor =  json.payload.results[0].paginationCursor;
                //console.log("cursor::: ",json.payload.results[0].paginationCursor);
            }catch(e) { 
                //console.log(e);
                if(e.message.trim() =="Cannot read property 'events' of undefined" ){
                    console.log(`${cityId} city is finished` );
                    hasNextPage = false;
                } 
                else if(e.message.trim() == "Cannot read property 'paginationCursor' of undefined"){
                    console.log(`${city} is finished` );
                    hasNextPage = false;
                }
                
                else if(e.message.includes("giriş yapılmalı")){
                    console.log("deneme");
                    console.log("::::::not:::: ",e);
                }
                else{
                    console.log("::::::not:::: ",e);
                    hasNextPage = false;
                }
            };
        } // while loop closed
        return eventsObjArr;
        
    }




    //*METHOD get Event details from event page-----------------------
    async function getEventDetail(eventObj){
        console.log("Getting details of event ", eventObj.eventId);

        const newEventObj = await new Promise ( async (resolve, reject) => {

            const eventId =  Number(eventObj.eventId);
            
            const axios = require('axios')
            const cheerio = require('cheerio');
    
            var organizator = "";
            var mapPicUrl = "";
            var other = "";
            var telNo = "";
            var email = "";
            var olineEvent = "";
            var ticketTitle = "";
            var ticketDetail = "";
            var mekan = "";
            var address = "";
            var time = "";
    
            // Use the `get` method of axios with the URL of the ButterCMS documentation page as an argument
            //url: 'https://www.facebook.com/events/716080808735268'
            //https://www.facebook.com/events/450458339174630
            //https://www.facebook.com/events/1699718656851757
            //https://www.facebook.com/events/339561723719593
            
            
            try {
                var response = await axios.get(`http://www.facebook.com/events/${eventId}`)
                    //.catch( e =>{ console.log("--- ",eventId,"----",  e.message); });  
                    // `response` is an HTTP response object, whose body is contained in it's `data` attribute
                 } catch(e) {
                     
                     if(e.message.includes("500")){
                        console.log(`500 hatası sayfa bulunamadı id of event ${eventId}`);
                        var fs = require('fs');
                        fs.appendFile('mynewfile1.txt ', ` ${eventId} 500 hatası aldı \n` , function (err) {
                            if (err) throw err;
                           // console.log('Saved!');
                        });
                        resolve();
                        return;
                    }
                     else{
                         console.log(e.message);
                        getEventDetail(eventObj);
                     }
                 }

            if(response.status == 200){
                    // This will print the HTML source code to the console
                    var htmlData = response.data;
                    htmlData = htmlData.replace(/<!--/g,'')
                    htmlData = htmlData.replace(/-->/g,'')
                    //console.log(htmlData);
        
                    let $ = cheerio.load(htmlData);
                         
                    //*event ulaşmak için giriş yapulması isteniyorsa
                    if( $("div._cqq").length > 0 )  { //  if( $("div._cqq").length == 0 
                        //console.log("tarayıcıda event sayfasına  giriliyor");
                        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
                        
                        var htmlDataDiff = await page.goto(`https://facebook.com/events/${eventId}`).then(async (res) => {
                            //* bu olmadan Error: net::ERR_ABORTED at http://www.facebook.com/events/1699718656851757 hatası alıyordum  //kaynak https://github.com/puppeteer/puppeteer/issues/1477  //kaynak2 https://github.com/puppeteer/puppeteer/issues/2794   
                            
                            //await page.setJavaScriptEnabled(false);
                            //await page.evaluate(() => {  debugger;  });
                            await page.waitForSelector("._xkh");
        
                            //* disable JavaScript after the page has loaded,
                            await res.text().then( async (htmlText) => {
                                htmlText = htmlText.replace(/<!--/g,'')
                                htmlText = htmlText.replace(/-->/g,'')
                                return htmlText;
                            });
        
                        }).catch( (e) => {
                            if(e.message.includes("net::ERR_ABORTED") ){
                                console.log("message:: ",e.message);
                                const eventId = e.message.split('/').pop();
                                console.log("ERROR message:: of event ${eventId} ",e.message);
                                var fs = require('fs');
                                fs.appendFile('mynewfile1.txt ', ` ${eventId} \n` , function (err) {
                                    if (err) throw err;
                                   // console.log('Saved!');
                                });
                                return;
                            }
                            else{
                                console.log("----ERR::",e.message,"----");
                                return;
                            }
        
                        });
        
                        //BEKLETME YAPILIYOR HTMLTEXTİN ÇEKİLDİĞİNDEN EMİN OLUNMAK İÇİN
                        if(await htmlDataDiff){
                            $ = cheerio.load(htmlDataDiff)
                            //console.log("yüklendi", htmlDataDiff);
                        }else {
                            console.log(`Try again event id::: ${eventId}...........`);
                            var fs = require('fs');
                            fs.appendFile('mynewfile1.txt ', ` ${eventId} Try again \n` , function (err) {
                                if (err) throw err;
                               // console.log('Saved!');
                            });
                        }
        
                    }
        
                    $("._xkh").each( (index, element) => {
        
                        //console.log("gettings data from event page");
        
                        //getting time
                        if($(element).find("div._2ycp").text()){
                            time = $(element).find("div._2ycp").text()
                            //console.log("time: ", time == "" ? "bunulanamdı" : time );
                        }
                        //getting mekan and address
                        if($(element).find("a._5xhk").text()){
                            mekan =  $(element).find("a._5xhk").text();
                            //console.log("mekan: ",mekan == "" ? "bunulanamdı" : mekan );
                        
                            address = $(element).find("div._5xhp").text();
                            //console.log("address: ",address == "" ? "bunulanamdı" : address );
                        }
        
                        //getting ticket title and ticket detail
                        if($(element).find("span._5xhk").text()){
                            ticketTitle = $(element).find("span._5xhk").text();
                            //console.log("ticketTitle: ", ticketTitle == "" ? "bunulanamdı" : ticketTitle );
        
                            ticketDetail =  $(element).find("div._5xhp").text();
                            //console.log("ticketDetail: ", ticketDetail == "" ? "bunulanamdı" : ticketDetail );
                        
                        }
        
                        //if event online getting link
                        if($(element).find("div._98dl > span").text()){
                            olineEvent = $(element).find("div._98dl > span").text();
                            //console.log("isOnline: ", true);
                            //console.log("olineEvent: ", olineEvent == "" ? "bunulanamdı" : olineEvent );
                        }
                    });
        
        
                    //getting tel mail with selector
                    let telAndEmail = $("div._4bl9._2qsg").find("span._c24").each( (index, element) => {
                        
                        if (index > 0){
                            other = $(element).text();
                            //console.log("other: ",other == "" ? "bunulanamdı" : other );
                        }
        
                        else if (index == 1){
                            telNo = $(element).text();
                            //console.log("telno: ",telNo == "" ? "bunulanamdı" : telNo );
                        }
                        else if (index == 2) {
                            email = $(element).text();
                            //console.log("email: ",email == "" ? "bulunamadı": email);
                        }   
        
                    });
        
                    telAndEmail;
        
                    mapPicUrl = $("div.fbPlaceFlyoutWrap").find("img._a3f.img").attr('src');
                    //console.log("mapPicUrl: ", mapPicUrl == "" ? "bunulanamdı" : mapPicUrl );
        
                    if(mapPicUrl){
                        //get lat lgr
                        var latitudeAndLongitude = mapPicUrl.substring(mapPicUrl.lastIndexOf("markers=")+8, mapPicUrl.lastIndexOf("&") );
                        var latitude =  latitudeAndLongitude.substring(  0, latitudeAndLongitude.lastIndexOf("%")  );  
                        var Longitude = latitudeAndLongitude.substring(  latitudeAndLongitude.lastIndexOf("%")+3 );
                        //console.log( "latitude: ", latitude == "" ? "bunulanamdı" : latitude );
                        //console.log( "longitude: ", Longitude == "" ? "bunulanamdı" : Longitude );   
                    }
            
                    organizator = $("div._4-u2._8urj._4-u8").find("._2ien").text();
                    //console.log("organizator: ",organizator == "" ? "bunulanamdı" : organizator );
        
        
                    eventObj["organizator"] = organizator;
                    eventObj["mapPicUrl"] = mapPicUrl;
                    eventObj["latitude"] = parseFloat(latitude);
                    eventObj['Longitude'] = parseFloat(Longitude);
                    eventObj["other"] = other;
                    eventObj["telNo"] = telNo;
                    eventObj["email"] = email;
                    eventObj["olineEvent"] = olineEvent;
                    eventObj["ticketTitle"] = ticketTitle;
                    eventObj["ticketDetail"] = ticketDetail;
                    eventObj["mekan"] = mekan;
                    eventObj["address"] = address;
                    eventObj["time"] = time;
        
                    //console.log(eventObj);
        
                    resolve(eventObj);
                }
        }).catch((e) => {
            console.log(e);
        });
        
         return await newEventObj;

    }//------------------------



 



    ///* puppeteer yapmadan direk fetch yöntemiyle çekmeyi başardığım ve daha hızlı olduğu için bu kısım iptal 

    
    //event getting from url-------------------
    async function getPostData(){
            console.log("getting new postData");
            page.goto('https://www.facebook.com/events/discovery/?suggestion_token={"city":"106012156106461"}&acontext={"ref":2,"ref_dashboard_filter":"upcoming","source":2,"source_dashboard_filter":"discovery","action_history":"[{\"surface\":\"dashboard\",\"mechanism\":\"main_list\",\"extra_data\":{\"dashboard_filter\":\"upcoming\"}},{\"surface\":\"discover_filter_list\",\"mechanism\":\"surface\",\"extra_data\":{\"dashboard_filter\":\"discovery\"}}]","has_source":true}');
            const postData  =  await new Promise( async (resolve, reject) => {
                return await page.on('request', async (request) => {     //sürekli dinleme yapılır
                    if (request.url() == "https://www.facebook.com/events/discover/query/"){
                        console.log('XHR response received'); 
                        //autoScroll();
        
                        let reqPostData = await request.postData();
                        resolve(reqPostData)
                    } 
                });
            })
            return postData;
        //console.log("events getting");
    }//--------------------------------


    async function getCookie(){
        console.log("getting new cookie")
        const gettingCookie = await new Promise( async (resolve,reject) => {
            var cookiesArr = await page.cookies();
            
            //console.log(cookies);
            //console.log("başlıyor");

            let fsCook = "";
            let newCookie = "";
            for ( const val of cookiesArr) {
                if(val.name == "fr"){
                    fsCook =  `${val.name}=${val.value}; `
                }else{
                    newCookie += `${val.name}=${val.value}; `;
                }
            }
            newCookie = fsCook + newCookie;
            resolve(newCookie);
        });
        return gettingCookie;
    }


    async function testConnection(){

        const isSuccessfull = await new Promise(async (resolve, reject) => {
            const axios = require('axios');
            var htmlText = await axios({
                method: 'post',
                url: encodeURI("https://www.facebook.com/events/discover/query/"),
                headers:{
                    "Host": "www.facebook.com",
                    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:79.0) Gecko/20100101 Firefox/79.0",
                    "Accept": "*/*",
                    "Accept-Language": "tr-TR,tr;q=0.8,en-US;q=0.5,en;q=0.3",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Origin": "https://www.facebook.com",
                    "Connection": "keep-alive",
                    "Cookie": cookie,
                    "TE": "Trailers",
                    "Referer": `https://www.facebook.com/events/discovery/?suggestion_token={"city":106012156106461}&acontext={"ref":2,"ref_dashboard_filter":"upcoming","source":2,"source_dashboard_filter":"discovery","action_history":"[{\"surface\":\"dashboard\",\"mechanism\":\"main_list\",\"extra_data\":{\"dashboard_filter\":\"upcoming\"}},{\"surface\":\"discover_filter_list\",\"mechanism\":\"surface\",\"extra_data\":{\"dashboard_filter\":\"discovery\"}},{\"surface\":\"discover_filter_list\",\"mechanism\":\"surface\",\"extra_data\":{\"dashboard_filter\":\"discovery\"}}]","has_source":true}`,
                },
                data: postData,
            }).then( (res) => res.data)
        
        try{
            htmlText = await  htmlText.substring(9);
            json = await JSON.parse(htmlText);

            //console.log(json.payload.results.length);
            if(json.payload.results.length > 0){
                console.log("test connection başarılı");
                resolve(true);
            }else{
                console.log("test connection başarısız");
                resolve(false);
            }
        } catch(e){
            console.log(e);
            resolve(false);
        }


        });
        return isSuccessfull;

        } 


    async function signOutForCookies(){
        const isSuccessfull = await new Promise( async (resolve,reject) => {
            
            //changeuser
            if(inWhichUser == faceUserArr.length-1 ){
                inWhichUser = 0;
            }else{
                inWhichUser++;
            }

        try{

            
            await page.waitForSelector("div._5lxr");
            await page.click("div._5lxr");
            console.log("navigasyon açılıdı")
            await page.waitForSelector("ul._54nf > li:last-child");
            await page.click("ul._54nf > li:last-child");
            
        }catch(e){
            await browser.close();
            page = await initPuppeteer();
        }
 

            let isLoginError = await loginToFacebook();
    
            if(isLoginError == false){
                resolve(true);
            }
            else{
                console.log("login gerçekleşmedi, isLoginError::",isLoginError);
                resolve(false);
            }
        });
        return isSuccessfull;
    }


    async function checkMissingPlace(){
        const isFinished = await new Promise( async (resolve, reject) => {
            postData = await getPostData();
            //console.log("postData::",postData);

            cookie = await getCookie();
            //console.log("cookie::", cookie);

            const placeObjectArr = await db.getAllPlaceId();
            //console.log(resultObjectArr);

            var totalCity = placeObjectArr.length;
            n = 0;

            for (const placesObj of placeObjectArr) {
                if(!await db.checkExistPlaceIdsOnEvent(placesObj.id)){
                    console.log("fetching city : ", placesObj.id);
                    if(await testConnection()){ //
                        const eventsArr = await fetchEvents(placesObj.id );   //* getting all events of specific city
                        console.log("fetching city : ", placesObj.id, "and fetching city of events length : ",eventsArr.length); 
                        if(eventsArr.length > 0){
                            //await page.waitFor(1000 + Math.floor(Math.random()*(999-100+1)+100) );
                            await Promise.all(eventsArr.map( async (event) => {
                                //console.log("eevveentts::",event.eventId);
                                await db.insertNewEvent(event);
                            }));
                        }
                        console.log(` % ${(n++)/totalCity } completed ` );
                    }else{
                        var isnotOkey = true;
                        while(isnotOkey){
                            //if testConection fail then signout and new cookies then continue to fetch that city
                            const isReAgainSuccessfull = await signOutForCookies();
                            console.log("isReAgainSuccessfull:::", isReAgainSuccessfull);
                            if(isReAgainSuccessfull){
                                cookie = await getCookie();
                                //console.log("cookkie::", cookie);
                                postData = await getPostData();
                                if(await testConnection()){  isnotOkey = false };
                                
                                const eventsArr = await fetchEvents(placesObj.id );   //* getting all events of specific city
                                console.log("fetching city : ", placesObj.id, "and fetching city of events length : ",eventsArr.length); 
                                if(eventsArr.length > 0){
                                    //await page.waitFor(100 + Math.floor(Math.random()*(999-100+1)+100) );
                                    await Promise.all(eventsArr.map( async (event) => {
                                        //console.log("eevveentts::",event.eventId);
                                        await db.insertNewEvent(event);
                                    }));
                                }
                                console.log(` % ${(n++)/totalCity } completed ` );
                            }
                        }
                    }
                }
            }
            resolve(true)
        });     
        return isFinished;
    }


    async function getEventsList(){
        
        //get postData and cookie
        postData = await getPostData();
        //console.log("postData::",postData);

        cookie = await getCookie();
        //console.log("cookie::", cookie);

        const resultObjectArr = await db.getAllPlaceId();
        //console.log(resultObjectArr);

        var totalCity = resultObjectArr.length;
        n = 0;
        for (const placesObj of resultObjectArr) {
            console.log("fetching city : ", placesObj.id);
            if(await testConnection()){ //
                const eventsArr = await fetchEvents(placesObj.id );   //* getting all events of specific city
                console.log("fetching city : ", placesObj.id, "and fetching city of events length : ",eventsArr.length); 
                if(eventsArr.length > 0){
                    //await page.waitFor(1000 + Math.floor(Math.random()*(999-100+1)+100) );
                    await Promise.all(eventsArr.map( async (event) => {
                        //console.log("eevveentts::",event.eventId);
                        await db.insertNewEvent(event);
                    }));
                }
                console.log(` % ${(n++)/totalCity } completed ` );
            }else{
                var isnotOkey = true;
                while(isnotOkey){
                    //if testConection fail then signout and new cookies then continue to fetch that city
                    const isReAgainSuccessfull = await signOutForCookies();
                    console.log("isReAgainSuccessfull:::", isReAgainSuccessfull);
                    if(isReAgainSuccessfull){
                        cookie = await getCookie();
                        //console.log("cookkie::", cookie);
                        postData = await getPostData();
                        if(await testConnection()){  isnotOkey = false };
                        
                        const eventsArr = await fetchEvents(placesObj.id );   //* getting all events of specific city
                        console.log("fetching city : ", placesObj.id, "and fetching city of events length : ",eventsArr.length); 
                        if(eventsArr.length > 0){
                            //await page.waitFor(100 + Math.floor(Math.random()*(999-100+1)+100) );
                            await Promise.all(eventsArr.map( async (event) => {
                                //console.log("eevveentts::",event.eventId);
                                await db.insertNewEvent(event);
                            }));
                        }
                        console.log(` % ${(n++)/totalCity } completed ` );
                    }
                }

            }

        };

    }

    /*
    //SCROLL YAPMAK İÇİN-------------------
    async function autoScroll(){

        console.log("autoScrolling");
        
        var error = false;
        
        //belirtilen selector yoksa autoScroll Yap
        await page.waitForSelector("iframe.k4urcfbm", {timeout: 50}).catch( (e) => {
            console.log("autoScrollWithoutFrame");
            autoScrollWithoutFrame();
        error = true; 
        });

        if(error){
            return ; 
        }


    //iframe olduğunda scroll
        const elementHandle = await page.$('div.ina5je9e > iframe');

        const frame = await elementHandle.contentFrame();
        //await frame.waitForNavigation();
        await frame.waitForSelector('div[role=\"heading\"]');
            
        const username = await frame.$('div[role=\"heading\"]');
        
        await username.click("strong");
        await page.waitFor(100);

        console.log("scroll için hazır");
        username.press('Space');
        username.press('Space');
        username.press('Space');
        username.press('Space');
        username.press('Space');
        username.press('Space');
        username.press('Space');
        username.press('Space');
        username.press('Space');
        username.press('Space');
        
    }//---------------------------
    

    //sayfada frame yoksa direk scroll yap--------------------
    async function autoScrollWithoutFrame(){
        console.log("frame bulunamadı frame tanımlamadan scrolll");
        page.keyboard.press('Space');
        page.keyboard.press('Space');
        page.keyboard.press('Space');
        page.keyboard.press('Space');
        page.keyboard.press('Space');
        page.keyboard.press('Space');
        page.keyboard.press('Space');
        page.keyboard.press('Space');

    }//--------------------------

*/

})();
