const axios = require('axios')
const cheerio = require('cheerio');
const fetch = require('node-fetch');


let pagCursor = "";
let hasNextPage = true;
let city = 109330919085413;

myDeneme(city);

async function myDeneme(city){

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
                console.log(json.payload.results[0].hasNextPage) 
        
                console.log(json.payload.results[0].events);
        
                pagCursor =  json.payload.results[0].paginationCursor;
                
             }catch(e) { console.log("loop bitti");  hasNextPage = false };
       
        });
    
    }

}

