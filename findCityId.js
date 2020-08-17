const axios = require('axios')

cities = [
    "Adana", "Adıyaman", "Afyon", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahraman maraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
]

var result = {};

cities.forEach( (val) => {
    console.log(val);
     findCityId(val).then ( () => {
        console.log(JSON.stringify(result.country.turkey.city));

    });
})

async function findCityId(city) {

    //GETTİNG CİTY İD CODE LİST
    await axios({
        method: 'post',
        url: encodeURI(`https://www.facebook.com/webgraphql/query/?query_id=1529221910536355&variables={"query_params":{"query":"${city}","viewer_coordinates":{},"provider":"here_thrift","search_type":"street_place_typeahead","integration_strategy":"string_match","result_ordering":"interleave","caller":"events_creation","page_category":["city"],"geocode_fallback":false},"max_results":10,"photo_width":50,"photo_height":50}`),
        headers:{
            "Host": "www.facebook.com",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:79.0) Gecko/20100101 Firefox/79.0",
            "Accept": "*/*",
            "Accept-Language": "tr-TR,tr;q=0.8,en-US;q=0.5,en;q=0.3",
            "Referer": "https://www.facebook.com/events/discovery/?suggestion_token=%7B%22city%22%3A%22106078429431815%22%2C%22timezone%22%3A%22Europe%2FParis%22%7D&acontext=%7B%22source%22%3A2%2C%22source_dashboard_filter%22%3A%22discovery%22%2C%22action_history%22%3A%22[%7B%5C%22surface%5C%22%3A%5C%22discover_filter_list%5C%22%2C%5C%22mechanism%5C%22%3A%5C%22surface%5C%22%2C%5C%22extra_data%5C%22%3A%7B%5C%22dashboard_filter%5C%22%3A%5C%22discovery%5C%22%7D%7D%2C%7B%5C%22surface%5C%22%3A%5C%22discover_filter_list%5C%22%2C%5C%22mechanism%5C%22%3A%5C%22surface%5C%22%2C%5C%22extra_data%5C%22%3A%7B%5C%22dashboard_filter%5C%22%3A%5C%22discovery%5C%22%7D%7D]%22%2C%22has_source%22%3Atrue%7D&cquick=jsc_c_e&cquick_token=AQ4Ctc6vbTp0owQn&ctarget=https%3A%2F%2Fwww.facebook.com",  
            "Content-Type": "application/x-www-form-urlencoded",
            "Origin": "https://www.facebook.com",
            "Connection": "keep-alive",
            "Cookie": "fr=1mB6DhpaPo931qzFx.AWWwhOKo6riTEjf4q8Rn2-iY6Ic.BeT-cH.rH.F6S.0.0.BfOB-C.AWVNnS_T; sb=B-dPXstezII1bLoZF1gELCQP; datr=B-dPXqbNGGbd66tnFzF67cIA; c_user=100029196555974; xs=7%3Arz6lBt9ovjxlBg%3A2%3A1583222913%3A-1%3A-1%3A%3AAcXliY4yvPuE5zk17eZqiCcBL8nWXJQkG0So7ppR1ls; wd=1696x512; presence=EDvF3EtimeF1597219579EuserFA21B29196555974A2EstateFDutF0CEchF_7bCC; dpr=1.1320754716981132; spin=r.1002522319_b.trunk_t.1597513879_s.1_v.2_",
            "TE": "Trailers"
        },
        data: "__user=100029196555974&__a=1&__dyn=7AgSXghFoOEjgDxKSudg9pEbEyGxuiEJ4WqwOwCwXCxCagjGqK6otyEnCG2S8BDyUJu9wSAxameK7GzU4qqfwKzorx6VFe4fxe489E-cGdw8i9xe6Ehwj8mwzx2qVk3Hwj8K1uCwXwCCwRxyWBBKdxR162afQmqEdRVodoKU9oOm1Ix3xim3u7o6icAz8aLxCmiQ10xnzoOmUbo429y9EtwhEaoK2ScDJe8xWbxm4UGqfwhUJ12262223Byovg94bxSF99ecg4u11x26U5au2u2WEspUjwgEhjy8O4bK2efxWcyUhwSwCxe6Utw9O222edwKx-by8C6EG4uUy3i1uDxG2G&__csr=&__req=a&__beoa=0&__pc=PHASED%3ADEFAULT&dpr=1.5&__ccg=EXCELLENT&__rev=1002522319&__s=whv1nz%3Am61g83%3A10g2c4&__hsi=6861287626947466710-0&__comet_req=0&cquick=jsc_c_e&cquick_token=AQ4Ctc6vbTp0owQn&ctarget=https%253A%252F%252Fwww.facebook.com&fb_dtsg=AQEk3G7W_jkO%3AAQExWdap_Anu&jazoest=22149&__spin_r=1002522319&__spin_b=trunk&__spin_t=1597513879",
    }).then( (res) => {
        //console.log("rreessspo");
        var jsonData = JSON.parse(res.data.substring(9));
        var resultArr = jsonData.payload[city].street_results.edges;
        //console.log(resultArr);
        

        result = {"country": { "turkey":{ "city" : { [city] : { }}  } } };

        //result["turkey"] = { "turkey2":"turkey3" };
        //result["turkey"]["turkey2"] = "turkey4";
        var cityJsObj = {};
        var locationJsObj = {};
        for(let i = 0; i< resultArr.length; i++){
            cityJsObj = { "id" : resultArr[i].node.page.id , "title" :  resultArr[i].node.place_name  };
            locationJsObj = resultArr[i].node.location;   
                
            result["country"]["turkey"]["city"][city][resultArr[i].node.place_name] = {};

            //making marge for location and city fields
            Object.keys(cityJsObj)
            .forEach(key => result["country"]["turkey"]["city"][city][resultArr[i].node.place_name][key] = cityJsObj[key]);

            Object.keys(locationJsObj)
            .forEach(key => result["country"]["turkey"]["city"][city][resultArr[i].node.place_name][key] = locationJsObj[key]);    

            //console.log(result)
        }
        //result["denizli"] = resultArr[0].node.city
//        console.log(result.country.turkey);

    });

}

