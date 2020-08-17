//https://dev.to/iduoad/how-to-scrape-facebook-events-for-fun-and-profit-26lo

const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

( async () => {

    var browser = null;
    var page = null;

    page = await initPuppeteer();
    let isLoginError = await loginToFacebook();

    if(isLoginError == false){
        await eventOperations();
        
    }
    else{
        console.log("login gerçekleşmedi, isLoginError::",isLoginError);
    }

    await browser.close();



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
                '--disable-web-security'
              ]
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
        await page.waitFor("input[type=\"text\"]");
        await page.click("input[type=\"text\"]")
        await page.keyboard.type("eayoz333@gmail.com");
    
        await page.waitFor("input[type=\"password\"]");
        await page.click("input[type=\"password\"]")
        await page.keyboard.type("r294294294");
    
        await page.waitFor("button[type=\"submit\"]");
        await page.click("button[type=\"submit\"]");
        let loginError = false;

        return await page.waitForSelector("div#mount_0_0", {timeout: 15000}).then( () => {
           console.log("login başarılı"); 
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



        //console.log( await (await page._client.send('Network.getAllCookies')).cookies[0]  );


        //let htmlContent = await page.evaluate
        
        //await getEvents(); //request yapılıyor ve belirtilen request sürekli dinleme yapılıyor. site hemen açılınca dinleme yapmak gerek yoksa geç kalabiliriz

        await fetchEvents(109330919085413);

        await page.waitFor(500);

        //await page.goto(eventurl);

        //getEventDetail();


    }//--------------------


    async function fetchEvents(city){

        let pagCursor = "";
        let hasNextPage = true;

        while(hasNextPage){

            //console.log("pagCursor:::: ",pagCursor);
        
            await fetch("https://www.facebook.com/events/discover/query/", {
                "headers": {
                "accept": "*/*",
                "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/x-www-form-urlencoded",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "cookie": "sb=toi1XvS4s6RnKI3fWlCTOr7J; datr=BafrXgZ3p4szXDybLghL_NUN; dpr=1.25; c_user=100009007514961; spin=r.1002522700_b.trunk_t.1597608533_s.1_v.2_; wd=1496x723; xs=30%3Ar1CQk1hp15dPFA%3A2%3A1597608529%3A17636%3A8911%3A%3AAcWcUmI4wuRdEJLFLQKEcLdftA3QPazxVkZvtC0jyg; fr=0G6htAwc3s8t8temd.AWU-WitvUjK-c38FkgL_2BPdSiA.BetV0E.yY.F8y.0.0.BfObOK.AWVjhu72"
                },
                "referrer": "https://www.facebook.com/events/discovery/?acontext=%7B%22event_action_history%22%3A[]%7D&cquick=jsc_c_e&cquick_token=AQ4xCKkma7KUA8_R&ctarget=https%3A%2F%2Fwww.facebook.com",
                "referrerPolicy": "origin-when-cross-origin",
                "body": `suggestion_token=%7B%22city%22%3A%22default_${city}%22%7D&cursor=${pagCursor}&timezone_id=1&__user=100009007514961&__a=1&__dyn=7AgSXghFoOEjgDxKSudg9pEbEyGxuiEJ4WqwOwCwXCxCagjGqK6otyEnCG2S8BDyUJu9wSAxameK7GzU4qqfwKzorx6VFe4fxe489E-cGdw8i9xe6Ehwj8mwzx2qVk3Hwj8J0npEeU9FEdooKFprzotghwyzZ5CG3tum3mbK2mcBAwpUgUkBwTxS1Az98O2HUpBAJ0g8lUScBK2S10yoyq7o4q2CbwJz9Xjy8uyUlxeaCzU4ubggwxwwwwVoC7Q2h2UtGiijz417wgogxK1iDwDwKG76u4U4a4kUycx2XwzzUuz8K4odE9EjxK7o2swwwzzobEvyUy9xGax7K8wQwnFUqwGw&__csr=&__req=1&__beoa=0&__pc=PHASED%3ADEFAULT&dpr=1.5&__ccg=GOOD&__rev=1002522700&__s=6gh45m%3A7b4cc4%3Apzreoe&__hsi=6861713588064728821-0&__comet_req=0&cquick=jsc_c_e&cquick_token=AQ4xCKkma7KUA8_R&ctarget=https%253A%252F%252Fwww.facebook.com&fb_dtsg=AQGwccQV6LgX%3AAQH9K3CvdJCR&jazoest=21989&__spin_r=1002522700&__spin_b=trunk&__spin_t=1597608533`,
                "method": "POST",
                "mode": "cors"
            }).then(res => res.text())
            .then(body => {
                body = body.substring(9);
                json = JSON.parse(body);
        
                //console.log(json.payload.results);

                try {
                    //console.log(json.payload.results[0].hasNextPage) 
            
                    console.log(json.payload.results[0].events);
            
                    pagCursor =  json.payload.results[0].paginationCursor;
                    
                }catch(e) { console.log("loop bitti");  hasNextPage = false };
        
            });        
        }
    
    }


    //get Event details from event page-----------------------
    function getEventDetail(){
        const axios = require('axios')
        const cheerio = require('cheerio');

        // Use the `get` method of axios with the URL of the ButterCMS documentation page as an argument
        //url: 'https://www.facebook.com/events/716080808735268'
        //https://www.facebook.com/events/450458339174630
        //https://www.facebook.com/events/1699718656851757
        //https://www.facebook.com/events/339561723719593
        axios.get('https://www.facebook.com/events/339561723719593').then((response) => {
            // `response` is an HTTP response object, whose body is contained in it's `data` attribute
            
            // This will print the HTML source code to the console
            var htmlData = response.data
            htmlData = htmlData.replace(/<!--/g,'')
            htmlData = htmlData.replace(/-->/g,'')
        //console.log(htmlData);
            //console.log()
            let $ = cheerio.load(htmlData);

            $("._xkh").each( (index, element) => {
                
                //getting time
                if($(element).find("div._2ycp").text()){
                    var time  = $(element).find("div._2ycp").text()
                    console.log("time: ", time == "" ? "bunulanamdı" : time );
                }

                //getting mekan and address
                if($(element).find("a._5xhk").text()){
                    var mekan =  $(element).find("a._5xhk").text();
                    console.log("mekan: ",mekan == "" ? "bunulanamdı" : mekan );
                
                    var address = $(element).find("div._5xhp").text();
                    console.log("address: ",address == "" ? "bunulanamdı" : address );
                }

                //getting ticket title and ticket detail
                if($(element).find("span._5xhk").text()){
                    var ticketTitle = $(element).find("span._5xhk").text();
                    console.log("ticketTitle: ", ticketTitle == "" ? "bunulanamdı" : ticketTitle );

                    var ticketDetail =  $(element).find("div._5xhp").text();
                    console.log("ticketDetail: ", ticketDetail == "" ? "bunulanamdı" : ticketDetail );
                
                }

                //if event online getting link
                if($(element).find("div._98dl > span").text()){
                    var olineEvent = $(element).find("div._98dl > span").text();
                    console.log("isOnline: ", true);
                    console.log("olineEvent: ", olineEvent == "" ? "bunulanamdı" : olineEvent );
                }
            });


            //getting tel mail with selector
            let telAndEmail = $("div._4bl9._2qsg").find("span._c24").each( (index, element) => {
                
                if (index == 0){
                    let other = $(element).text();
                    console.log("other: ",other == "" ? "bunulanamdı" : other );
                }

                else if (index == 1){
                    let telNo = $(element).text();
                    console.log("telno: ",telNo == "" ? "bunulanamdı" : telNo );
                }
                else if (index == 2) {
                    let email = $(element).text();
                    console.log("email: ",email == "" ? "bulunamadı": email);
                }   

            });

            telAndEmail;

            let mapPicUrl = $("div.fbPlaceFlyoutWrap").find("img._a3f.img").attr('src');
            console.log("mapPicUrl: ", mapPicUrl == "" ? "bunulanamdı" : mapPicUrl );

            if(mapPicUrl){
                //get lat lgr
                var latitudeAndLongitude = mapPicUrl.substring(mapPicUrl.lastIndexOf("markers=")+8, mapPicUrl.lastIndexOf("&") );
                var latitude =  latitudeAndLongitude.substring(  0, latitudeAndLongitude.lastIndexOf("%")  );  
                var Longitude = latitudeAndLongitude.substring(  latitudeAndLongitude.lastIndexOf("%")+3 );
                console.log( "latitude: ", latitude == "" ? "bunulanamdı" : latitude );
                console.log( "longitude: ", Longitude == "" ? "bunulanamdı" : Longitude );   
            }
    
            let organizator = $("div._4-u2._8urj._4-u8").find("._2ien").text();
            console.log("organizator: ",organizator == "" ? "bunulanamdı" : organizator );

        })          
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
