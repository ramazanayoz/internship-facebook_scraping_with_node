const axios = require('axios')
const myDbService= require("./server/myDbService");

const db = myDbService.getDbServiceInstance();

cities = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahraman maraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
]

var result = {};

cities.forEach( (val) => {
    console.log(val);
     findCityId(val).then ( () => {
       // console.log(JSON.stringify(result.country.turkey.city));

    });
})


findCityId("ankara"); 
async function findCityId(city) {

    //GETTİNG CİTY İD CODE LİST
    await axios({
        method: 'post',
        url: encodeURI(`https://www.facebook.com/webgraphql/query/?query_id=1529221910536355&variables={"query_params":{"query":"${city}","viewer_coordinates":{},"provider":"here_thrift","search_type":"street_place_typeahead","integration_strategy":"string_match","result_ordering":"interleave","caller":"events_creation","page_category":["city"],"geocode_fallback":false},"max_results":15,"photo_width":50,"photo_height":50}`),
        headers:{
            "Host": "www.facebook.com",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:79.0) Gecko/20100101 Firefox/79.0",
            "Accept": "*/*",
            "Accept-Language": "tr-TR,tr;q=0.8,en-US;q=0.5,en;q=0.3",
            "Referer": "https://www.facebook.com/events/discovery/?suggestion_token=%7B%22city%22%3A%22106012156106461%22%7D&acontext=%7B%22source%22%3A2%2C%22source_dashboard_filter%22%3A%22discovery%22%2C%22action_history%22%3A%22[%7B%5C%22surface%5C%22%3A%5C%22discover_filter_list%5C%22%2C%5C%22mechanism%5C%22%3A%5C%22surface%5C%22%2C%5C%22extra_data%5C%22%3A%7B%5C%22dashboard_filter%5C%22%3A%5C%22discovery%5C%22%7D%7D]%22%2C%22has_source%22%3Atrue%7D",
            "Content-Type": "application/x-www-form-urlencoded",
            "Origin": "https://www.facebook.com",
            "Connection": "keep-alive",
            "Cookie": "fr=1mB6DhpaPo931qzFx.AWURgPBsX8A_r4-LW8b-61Y-Aiw.BeT-cH.rH.F6S.0.0.BfO8ft.AWWmf4M2; sb=B-dPXstezII1bLoZF1gELCQP; datr=B-dPXqbNGGbd66tnFzF67cIA; c_user=100029196555974; xs=7%3Arz6lBt9ovjxlBg%3A2%3A1583222913%3A-1%3A-1%3A%3AAcW59aGJRY9GhlQg3leauCXprHEFNQJxCZrzafqR608; wd=515x899; presence=EDvF3EtimeF1597761138EuserFA21B29196555974A2EstateFDutF1597761138485CEchF_7bCC; spin=r.1002523633_b.trunk_t.1597690496_s.1_v.2_",
            "TE": "Trailers",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
        },
        data: "__user=100029196555974&__a=1&__dyn=7AgNeS4amcG4Q9UoGSF8CC5EWq2W8GEnAG8F4WqwOwCzob4q6oF1eFGUpxSaxuqEboymubyRUC6UnGiidBzHxWAewXyFE-26czorx6VFe4fxe48pz8-cGdCwq8kyoyaxG4o4O5K2649HBgeJ0QxqbwlFVEeUryFEdooKFprzooAghBy8jByt5CG3tum3mbK6UCcBwr8gUkBzXwzxS14xCmcAz8aLxCmiQhxfwzxnzoOmUpxe48bUC8CyUhwXyEaoKfAgnLCDJe8xWbxm4UGqfwRx6bggDx28wwK7em9xyp3omgK7qAAAUN0hUy4Egxi48rwPxWF89UbGxNDxe12x5e8z9Uy_wzzUuz8K443q2q4UrxS4Umwso888US2W7UK8yoqyEhXy8dbwmFUqwGw&__csr=&__req=o&__beoa=0&__pc=PHASED%3ADEFAULT&dpr=1&__ccg=GOOD&__rev=1002523633&__s=la00s6%3Afn4q7w%3Al1cqeu&__hsi=6862331800759741208-0&__comet_req=0&fb_dtsg=AQEomu8WurVw%3AAQH8u-typJRS&jazoest=22213&__spin_r=1002523633&__spin_b=trunk&__spin_t=1597690496",
    }).then( (res) => res.data)
        .then(data => {
           var jsonObj = JSON.parse( data.substring(9)); 
           var edgesArr = jsonObj.payload[city].street_results.edges;

            edgesArr.forEach( async cityObj => {
                
                var cityName =  cityObj.node.place_name;
                var CitySearching = city;
                var cityId =   cityObj.node.page.id ;
                var cityLatitude = cityObj.node.location.latitude;
                var cityLongitude =  cityObj.node.location.longitude;
                var country = "turkey";

                cityJsonObj = {  "CitySearching": CitySearching,  "cityName": cityName,  "cityId": cityId, "cityLatitude": cityLatitude, "cityLongitude": cityLongitude, "country": country };
                //console.log(cityJsonObj);
                //console.log("sıradaki");

                if(cityName.includes(CitySearching)){
                    db.addNewPlace(cityJsonObj);
                };
                console.log("next");
               
            });
            
        });
        console.log("bitti");

}