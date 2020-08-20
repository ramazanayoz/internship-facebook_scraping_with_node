const mysql = require('mysql');
let instance = null;


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'testAdmin',
    password: '123456',
    database: 'db_faceEvents',
    port: '3306'
})

connection.connect( (err) => {
    if(err){
        console.log(err.message);
    }
    console.log('db '+connection.state);
});


class MyDbService {

    //singeleten pattern
    static getDbServiceInstance(){
        return instance ? instance : new MyDbService();
    }

    //methods
    async addNewPlace(cityJsonObj){

        const isSuccess = await new Promise((resolve, reject) => {
            var cityId =  parseInt(cityJsonObj.cityId);

            let title = cityJsonObj.cityName;
            let searchedCity = cityJsonObj.CitySearching; 
            let latitude = cityJsonObj.cityLatitude;
            let longitude = cityJsonObj.cityLongitude;
            const dateAdded = new Date();
            let country = cityJsonObj.country;
            const query = "INSERT INTO places (id, searchedCity, title, latitude, longitude, dateAdded, country) VALUES (?,?,?,?,?,?,?);";
            connection.query(query,  [cityId, searchedCity, title,latitude,longitude, dateAdded, country], (err, result) => {
                if(err){
                    if( err.code == "ER_DUP_ENTRY" ){
                        reject(Error(err.message));
                    }else{
                        reject(Error(err.message));
                    }
                }
                else{
                    if(result.affectedRows == 1){
                        resolve(true);
                    }else{
                        console.log("something is going wrong")
                        resolve("something is going wrong");
                    }
                }
            })
        }).catch((error) => { return error.message })
        console.log( await isSuccess)
        return;
    }
}


module.exports = MyDbService;