const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
})

app.post('/', function(req, res) {
    const postcode = req.body.pcodeSearch
    const location_api_url = "https://api.getthedata.com/postcode/" + postcode;

    console.log(location_api_url)

    https.get(location_api_url, function(response) {
        response.on("data", function(data){

            //console.log(data)
            const locData = data.toString()
            console.log(locData)           
            const data_loc = JSON.parse(locData)
            const longitude = (data_loc.data.longitude)
            const latitude = (data_loc.data.latitude)
            console.log(longitude + ' '+ latitude)
            res.send(longitude + ' '+ latitude)
        })
    })
    
    // const police_api_url = "https://data.police.uk/api/crimes-at-location?"

    //     https.request(police_api_url, function(response) {
    //     response.on("data", function(data){
    //         const locData = JSON.parse(data);
    //         const longitude = (locData.result.longitude)
    //         const latitude = (locData.result.latitude)            
    //     })
    // })
    
})


app.listen(process.env.PORT || 3000, function() {
    console.log("Server listening");
});

