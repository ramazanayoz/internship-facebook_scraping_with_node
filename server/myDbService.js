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


    //methods
    async getAllPlaceId(){

        const resultObj = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM places";
            connection.query(query, (err, result) => {
                if(err){
                    
                    reject(new Error(err.message));
                }
                else{
                    resolve(result);;
                }
            })
        }).catch((error) => { return error.message })

        return resultObj;
    }


    async deleteAllPlacesFromDB(){
        const response = await new Promise((resolve, reject) => {
            const query = "DELETE FROM places";
            connection.query(query, (err, result) => {
                if(err){
                    reject(new Error(err.message));
                }
                else{
                    console.log(result);
                    if(result.affectedRows > 0) resolve(true);
                    else resolve(false);
                }
            })
        }).catch((error) => { return error.message });
        console.log("is deleted all places : ", response);
        return response;
    }

    
   //methods
    async insertNewEvent(eventObj){
        const isSuccess = await new Promise((resolve, reject) => {
            var eventId =  eventObj.eventId;
            var cityId = eventObj.cityId;
            var eventTitle = eventObj.eventTitle;
            var eventDay = eventObj.eventDay;
			var eventDateAndTime = eventObj.eventDateAndTime;
			var time = eventObj["time"];			
            var eventLocation = eventObj.eventLocation;
			var residence = eventObj["mekan"];
            var fullAddress = eventObj["address"];
			var mapPicUrl = eventObj["mapPicUrl"];
            var latitude = eventObj["latitude"];
            var longitude = eventObj['Longitude'];
			var organizator = eventObj["organizator"];
            var isFreeEvent = eventObj.isFreeEvent;
            var isHappeningNowEvent = eventObj.isHappeningNowEvent;
            var telNo = eventObj["telNo"];
            var email = eventObj["email"];
			var other = eventObj["other"];
            var isOnlineEvent = eventObj.isOnlineEvent;
			var olineEvent = eventObj["olineEvent"];
            var eventBuyTicketUrl = eventObj.eventBuyTicketUrl;
            var ticketTitle = eventObj["ticketTitle"];
            var ticketDetail = eventObj["ticketDetail"];
            var eventsocialContext = eventObj.eventsocialContext;
            var eventDescription = eventObj.eventDescription;

            //const query = "INSERT INTO places (id, searchedCity, title, latitude, longitude, dateAdded, country) VALUES (?,?,?,?,?,?,?);";

            const query = 'INSERT INTO events (id, cityId, title, day, dateAndTime, time, location, residence, fullAddress, mapPicUrl, latitude, longitude, organizator, isFree, isHappeningNow, telNo, email, other, isOnlineEvent, olineEvent,buyTicketUrl,ticketTitle, ticketDetail, socialContext, description) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);';

            connection.query(query,  [
                mysql.escape(eventId),
                mysql.escape(cityId),
                mysql.escape(eventTitle), 
                mysql.escape(eventDay),
                mysql.escape( eventDateAndTime), 
                mysql.escape(time),
                mysql.escape(eventLocation), 
                mysql.escape(residence),
                mysql.escape(fullAddress), 
                mysql.escape(mapPicUrl),
                mysql.escape(latitude),
                mysql.escape(longitude), 
                mysql.escape(organizator),
                mysql.escape(isFreeEvent),
                mysql.escape(isHappeningNowEvent), 
                mysql.escape(telNo),
                mysql.escape(email),
                mysql.escape(other),
                mysql.escape(isOnlineEvent), 
                mysql.escape(olineEvent),
                mysql.escape(eventBuyTicketUrl),
                mysql.escape(ticketTitle),
                mysql.escape(ticketDetail), 
                mysql.escape(eventsocialContext), 
                mysql.escape(eventDescription)
            ], (err, result) => {
                if(err){
                    if( err.code == "ER_DUP_ENTRY" ){
                        reject(Error("DUP_ENTRYFOR_", eventId));
                    }else{
                        reject(Error(err));
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
        console.log( await isSuccess);
        console.log("successfully write to db: ", eventObj.eventId);
        return;
    }


    async checkEventExist(eventId){
        const isExist = await new Promise( (resolve, reject) => {
            const query = "SELECT * FROM events WHERE id = ?;";
            connection.query(query, [eventId], (err, result) => {
                if(err)
                    reject(new Error(err.message));
                else{
                    //console.log(result.length);
                    if(result.length > 0) resolve(true);
                    else resolve(false);
                    
                }
            });
        });

        return  isExist;
    }

    async checkExistPlaceIdsOnEvent(placeId){
        const isExist = await new Promise( (resolve, reject) => {
            const query = "SELECT * FROM events Where cityId = ?;";
            connection.query(query, [placeId], (err, result) => {
                if(err)
                    reject(new Error(err.message));
                else{
                    if(result.length > 0) resolve(true);
                    else resolve(false);
                }
            });
        });
        console.log(isExist);
        return isExist
    }

}


//const db = MyDbService.getDbServiceInstance();
//db.getAllPlaceId(); 
//db.checkEventExist(3073616140408911);

module.exports = MyDbService;