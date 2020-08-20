//https://dev.to/iduoad/how-to-scrape-facebook-events-for-fun-and-profit-26lo

const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

( async () => {
    
    //***** MAİN*/
    var browser;
    let page ;

    page = await initPuppeteer();

    let isLoginError = await loginToFacebook();

    if(isLoginError == false){
        await eventOperations();
        
    }
    else{
        console.log("login gerçekleşmedi, isLoginError::",isLoginError);
    }
    /*** */
    //await browser.close();



    async function initPuppeteer(){
        const url = 'https:/www.facebook.com'
        browser = await puppeteer.launch({
            headless: false,
            args: [
                "--disable-notifications",
                '--no-sandbox',
                "--ignore-certificate-errors",
                "--proxy-server='direct://",
                "--proxy-bypass-list=*",
                "--disable-setuid-sandbox",
                '--disable-web-security',
                
                '--disable-gpu',
                '--window-size=1920x1080'
              ],
            browserContext: "default",
        });
    
    
        const page = await browser.newPage();
    
        page.setViewport({width: 1500, height: 764});
    
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
        await page.keyboard.type("eayoz333@gmail.com");
    
        await page.waitFor("input");
        await page.click("input[type=\"password\"]")
        await page.keyboard.type("r294294294");

        await page.waitFor("input");
        await page.click("input[type=\"submit\"]");
    }//--------------------------



    //login1 olmadıysa login2 --------------
    async function login2() { 
        console.log("login2 ile giriş yapılıyor")
        await page.waitFor("input[type=\"text\"]");
        await page.click("input[type=\"text\"]")
        await page.keyboard.type("eayoz333@gmail.com");
    
        await page.waitFor("input[type=\"password\"]");
        await page.click("input[type=\"password\"]")
        await page.keyboard.type("r294294294");
    
        await page.waitFor("button[type=\"submit\"]");
        await page.click("button[type=\"submit\"]");
        let loginError = false;

        return await page.waitForSelector("div#content_container", {timeout: 15000}).then( () => {
           console.log("login2 başarılı"); 
           return loginError = false;
        }).catch((e) => {
            console.log("bir problem oluştu");
            page.waitForSelector("form[ajaxify=\"/checkpoint/async?next\"]", {timeout: 3000}).then(() => {
                console.log("güvenlik sorunu çözülüyor"); 
                solveSecurityProblem(); 
            }).catch((e) => {
                console.log("solveSecurityProblem'de problem oluştu")
                return loginError = true;
            })
        });

        return loginError = true;

    }//-------------------------



    

    //login ile giriş yapılmadıysa doğrulama isteniyor--------------------
    async function solveSecurityProblem(){ 
        
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


    }//---------------------------------

    //doğrulama yaparken gerekli sadece-------------------------
    async function signInGoogle(){ 
        await popup.setViewport({ width: 1500, height: 764 });

        try {
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
            await page.waitFor(2000);

            await page.evaluate(`window.confirm = () => true`)
            await page.waitFor("div.dialog_buttons >  div > label > input", {visible:true});
            console.log("beklendi");
            await page.click("div.dialog_buttons >  div > label > input");

            await page.waitFor("#button#checkpointSubmitButton", {visible:true})
            await page.click("button#checkpointSubmitButton");

        } catch(e) {
            console.log("error", e);
        }
    }//--------------------


    //visiting event page and scrapping events----------------
    async function eventOperations(){
        console.log("event operations working");


        //console.log( await (await page._client.send('Network.getAllCookies')).cookies[0]  );


        //let htmlContent = await page.evaluate
        
        //await getEvents(); //request yapılıyor ve belirtilen request sürekli dinleme yapılıyor. site hemen açılınca dinleme yapmak gerek yoksa geç kalabiliriz

        await fetchEvents(106478736056198);
        console.log("browserClosed");



        
       // await browser.close();
        //await page.waitFor(500);

        //await page.goto(eventurl);
        //await getEventDetail({ "eventId":1281724818686396});

        //const out = await Promise.all(promiseFetch)  

        //console.log("out::::",out)

    }//--------------------


    async function fetchEvents(city){
        console.log("events fetching");
        
        let pagCursor = "";
        let hasNextPage = true;

        while(hasNextPage){

            //console.log("pagCursor:::: ",pagCursor);
        
            var htmlText= await fetch("https://www.facebook.com/events/discover/query/", {
                "credentials": "include",
                "headers": {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:79.0) Gecko/20100101 Firefox/79.0",
                    "Accept": "*/*",
                    "Accept-Language": "tr-TR,tr;q=0.8,en-US;q=0.5,en;q=0.3",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Cookie": "fr=1mB6DhpaPo931qzFx.AWUxfUTfso4tM4TcOfG8VUuo6RY.BeT-cH.rH.F6S.0.0.BfPMim.AWVus3-B; sb=B-dPXstezII1bLoZF1gELCQP; datr=B-dPXqbNGGbd66tnFzF67cIA; c_user=100029196555974; xs=7%3Arz6lBt9ovjxlBg%3A2%3A1583222913%3A-1%3A-1%3A%3AAcWOdEF38pRVmLl5qq8p4bKt56QoWMm2M7sU50_qDX0; wd=1140x589; presence=EDvF3EtimeF1597777223EuserFA21B29196555974A2EstateFDutF1597777223857CEchF_7bCC; spin=r.1002536864_b.trunk_t.1597819042_s.1_v.2_"
                },
                "body": `suggestion_token=%7B%22city%22%3A%22${city}%22%2C%22timezone%22%3A%22Europe%2Fİstanbul%22%7D&cursor=${pagCursor}&timezone_id=1&__user=100029196555974&__a=1&__dyn=7AgNeS4amcG4Q9UoGSF8CC5EWq2W8GEnAG8F4WqwOwCzob4q6oF1eFGUpxSaxuqEboymubyRUC6UnGiidBzHxWAewXyFE-26czorx6VFe4fxe48pz8-cGdCwq8kyoyaxG4o4O5K2649HBgeJ0QxqbwlFVEeUryFEdooKFprzooAghBy8jByt5CG3tum3mbK6UCcBwr8gUkBzXwzxS14xCmcAz8aLxCmiQhxfwzxnzoOmUpxe48bUC8CyUhwXyEaoKfAgnLCDJe8xWbxm4UGqfwRx6bggDx28wwK7em9xyp3omgK7qAAAUN0hUy4Egxi48rwPxWF89UbGxNDxe12x5e8z9Uy_wzzUuz8K443q2q4UrxS4Umwso888US2W7UK8yoqyEhXy8dbwmFUqwGw&__csr=&__req=l&__beoa=0&__pc=PHASED%3ADEFAULT&dpr=1&__ccg=EXCELLENT&__rev=1002536864&__s=ehaysm%3Auisglq%3Afqnz9m&__hsi=6862631500803979102-0&__comet_req=0&fb_dtsg=AQH3yR9Oacbb%3AAQHAZrrImSMC&jazoest=22068&__spin_r=1002536864&__spin_b=trunk&__spin_t=1597819042`,
                "method": "POST",
                "mode": "cors"
            }).then(res =>  res.text())

            htmlText = htmlText.substring(9);
            json = JSON.parse(htmlText);
        
            //console.log(json.payload.results[0].events);
            try {
                
                var eventsArr = json.payload.results[0].events;

                console.log(eventsArr.length);
                //for( i = 0; i < eventsArr.length; i++) { //kaynak prmise.all en hızlı sonra for of sonra for https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop  
                //burayı incele foreach içinde kullanmak istiyorsan daha hızllı olması için  https://stackoverflow.com/questions/48864589/how-to-scrape-multi-level-links-using-puppeteer-js
                for (const event of eventsArr) {
                //console.log(event); 
                    //var event = eventsArr[i];

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

                    const fulleventObj = await getEventDetail(eventObj);

                    console.log("fulleventObj", fulleventObj.eventId);
                    fulleventObj;
                    console.log("sıradaki");
                };
                
                //console.log(json.payload.results[0].events);
        
                pagCursor =  json.payload.results[0].paginationCursor;
                console.log("cursor::: ",json.payload.results[0].paginationCursor);
            }catch(e) { 
                if(e.message =="Cannot read property 'events' of undefined" ){
                    hasNextPage = false;
                } else{
                    console.log(e.message);
                }
                console.log("loop bitti");  
                hasNextPage = false;
            };
                 
        } // while loop closed

    }


    //get Event details from event page-----------------------
    async function getEventDetail(eventObj){
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
         const response = await axios.get(`http://www.facebook.com/events/${eventId}`)
            .catch( e =>{ console.log("---",e.message); });  
            // `response` is an HTTP response object, whose body is contained in it's `data` attribute

            // This will print the HTML source code to the console
            var htmlData = response.data
            htmlData = htmlData.replace(/<!--/g,'')
            htmlData = htmlData.replace(/-->/g,'')
            //console.log(htmlData);
            let $ = cheerio.load(htmlData);
            
            console.log("lentght:::" , $("div._cqq").length);
            
            //*if it shows login for continue 
            if( $("div._cqq").length > 0 )  {
                console.log("gggirdi");
                $ = await new Promise(async (resolve,reject) => {
                    //* bu olmadan Error: net::ERR_ABORTED at http://www.facebook.com/events/1699718656851757 hatası alıyordum  //kaynak https://github.com/puppeteer/puppeteer/issues/1477  //kaynak2 https://github.com/puppeteer/puppeteer/issues/2794   
                    //await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
                    //await page.setJavaScriptEnabled(false);

                    await page.goto(`https://facebook.com/events/${eventId}`).then(async (res) => {

                    await page.waitForSelector("._xkh");
                    await page.waitFor(1500);

                        //* disable JavaScript after the page has loaded,
                        await page.evaluate(() => {
                            debugger;
                        });

                        res.text().then((htmlText) => {
                            console.log("gggirdi2");
                            htmlText = htmlText.replace(/<!--/g,'')
                            htmlText = htmlText.replace(/-->/g,'')
                            resolve(cheerio.load(htmlText));
                        })
                    }).catch( (e) => {
                        console.log("-e.e..e-----",e.message,"----");
                        reject(false);
                    });
                }); 
            }

            $("._xkh").each( (index, element) => {

                console.log("gettings data from event page");

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
                
                if (index == 0){
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

            return eventObj;

    }//------------------------



 

    ///* puppeteer yapmadan direk fetch yöntemiyle çekmeyi başardığım ve daha hızlı olduğu için bu kısım iptal 

    /*
    //event getting from url-------------------
    async function getEvents(){
        console.log("events getting");
        
        let json = null;

        await page.on('response', async (response) => {     //sürekli dinleme yapılır
            if (response.url() == "https://www.facebook.com/events/discover/query/"){
                console.log('XHR response received'); 
                autoScroll();

                let res = await response.text();
                json = await JSON.parse(res.substring(9));
                json = await json.payload.results[0].events;
                console.log(json);

                
                return json
            } 
        });

    }//--------------------------------


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
