const axios = require('axios')
const myDbService= require("./server/myDbService");

const db = myDbService.getDbServiceInstance();

(async () => {await db.deleteAllPlacesFromDB(); })();  //fonk içinde async olmadan await çalıştırmanın yolu bu parantezler

cities = [ //https://deasciifier.com turkish char to eng char
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahraman maraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce",
    "Adana", "Adiyaman", "Afyonkarahisar", "Agri", "Amasya", "Ankara", "Antalya", "Artvin", "Aydin", "Balikesir", "Bilecik", "Bingol", "Bitlis", "Bolu", "Burdur", "Bursa", "Canakkale", "Cankiri", "Corum", "Denizli", "Diyarbakir", "Edirne", "Elazig", "Erzincan", "Erzurum", "Eskisehir", "Gaziantep", "Giresun", "Gumushane", "Hakkari", "Hatay", "Isparta", "Mersin", "Istanbul", "Izmir", "Kars", "Kastamonu", "Kayseri", "Kirklareli", "Kirsehir", "Kocaeli", "Konya", "Kutahya", "Malatya", "Manisa", "Kahraman maras", "Mardin", "Mugla", "Mus", "Nevsehir", "Nigde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdag", "Tokat", "Trabzon", "Tunceli", "Sanliurfa", "Usak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kirikkale", "Batman", "Sirnak", "Bartin", "Ardahan", "Igdir", "Yalova", "Karabuk", "Kilis", "Osmaniye", "Duzce"
]

var result = {};

cities.forEach( (val) => {
    console.log(val);
     findCityId(val).then ( () => {
       // console.log(JSON.stringify(result.country.turkey.city));

    });
})


//findCityId("ankara");
 
async function findCityId(city) {

    //GETTİNG CİTY İD CODE LİST
    await axios({
        method: 'post',
        url: encodeURI(`https://www.facebook.com/webgraphql/query/?query_id=1529221910536355&variables={"query_params":{"query":"${city}","viewer_coordinates":{},"provider":"here_thrift","search_type":"street_place_typeahead","integration_strategy":"string_match","result_ordering":"interleave","caller":"events_creation","page_category":["city"],"geocode_fallback":false},"max_results":20,"photo_width":50,"photo_height":50}`),
        headers:{
            "Host": "www.facebook.com",
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:79.0) Gecko/20100101 Firefox/79.0",
            "Accept": "*/*",
            "Accept-Language": "tr-TR,tr;q=0.8,en-US;q=0.5,en;q=0.3",
            "Referer": "https://www.facebook.com/events/discovery/?acontext=%7B%22ref_dashboard_filter%22%3A%22upcoming%22%2C%22source%22%3A%222%22%2C%22action_history%22%3A%22[%7B%5C%22surface%5C%22%3A%5C%22dashboard%5C%22%2C%5C%22mechanism%5C%22%3A%5C%22main_list%5C%22%2C%5C%22extra_data%5C%22%3A%7B%5C%22dashboard_filter%5C%22%3A%5C%22upcoming%5C%22%7D%7D]%22%7D",            //"Accept-Encoding: gzip, deflate, br
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": "778",
            "Origin": "https://www.facebook.com",
            "Connection": "keep-alive",
            "Cookie": "fr=1mB6DhpaPo931qzFx.AWUpkXCAZrDhZjVSH5tyU2UECmE.BeT-cH.rH.F9A.0.0.BfQDb2.AWWRfuCz; sb=B-dPXstezII1bLoZF1gELCQP; datr=B-dPXqbNGGbd66tnFzF67cIA; wd=1295x909; locale=tr_TR; c_user=100009007514961; xs=26%3Azt65DS0V7PlDuQ%3A2%3A1598043885%3A17636%3A8911; spin=r.1002552981_b.trunk_t.1598043887_s.1_v.2_; presence=EDvF3EtimeF1598045740EuserFA21B09007514961A2EstateFDutF1598045740391CEchF_7bCC",
            "TE": "Trailers"
        },
        data: "__user=100009007514961&__a=1&__dyn=7AgNeS4amaWxd2u6aJGi9FxqeCwKyaG5VayaheCEcEK6ES2N6xCagjGqK6otyEnCG2S8BDyUJu9xK5WAAzpoWUG4WgW3KaCzU8oOdxK4rCAUg-4Uggoz8KUOESq5o5a58C8yEqx61cxrwxx2qVk3HguzFEmUB0lpVk3K6UGqfwAgoKFprzooAghBy8jXyt5CG3tum3mbK6UCcBAxC1dx3ximf-79Etwhay9pVoOicwG-6ppbh64-2e5udz9rBxe4UgwLypqCyUhwKz8GE9EKEOh1u-quQUy7EK5ojyFE-3m4oJ12u48y22UsVoC9zFAdxp2UtGiijz417y8ix258gxK3e7GAwDwKG76u4U4a4kUycDyb-2efxWcyUgjBwIwCxe6Utxe5E76222edwKx-bxa6EG4uUy3iU5Gu6EaE&__csr=&__req=1h&__beoa=0&__pc=PHASED%3ADEFAULT&dpr=1&__ccg=MODERATE&__rev=1002552981&__s=y8lhqo%3Ajxx8wh%3Ahbwhgp&__hsi=6863554152727134467-0&__comet_req=0&fb_dtsg=AQFGye6J_6pH%3AAQF_-8RgeJ1Q&jazoest=21930&__spin_r=1002552981&__spin_b=trunk&__spin_t=1598043887",
    }).then( (res) => res.data)
        .then( async data => {
           var jsonObj = JSON.parse( data.substring(9)); 
           var edgesArr = jsonObj.payload[city].street_results.edges;

            await Promise.all(edgesArr.map( async cityObj => {
                
                var cityName =  cityObj.node.place_name;
                var CitySearching = city;
                var cityId =   cityObj.node.page.id ;
                var cityLatitude = cityObj.node.location.latitude;
                var cityLongitude =  cityObj.node.location.longitude;
                var country = "turkey";


                cityJsonObj = {  "CitySearching": CitySearching,  "cityName": cityName,  "cityId": cityId, "cityLatitude": cityLatitude, "cityLongitude": cityLongitude, "country": country };
                console.log(cityJsonObj.CitySearching);
                //console.log("sıradaki");

                if( cityName.includes(CitySearching)) {
                   await db.addNewPlace(cityJsonObj);
                };
                //console.log("next");
               
            }));
            
        });
        console.log("bitti");

}