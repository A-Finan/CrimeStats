const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));



app.get('/', function(req, res){
    res.render("pages/main.ejs");
})


app.post('/search', function(req, res) {
    const postcode = req.body.pcodeSearch
    const date = req.body.dateSearch
    console.log(date);
    const location_api_url = "https://api.getthedata.com/postcode/" + postcode;
    // console.log(location_api_url)
    https.get(location_api_url, function(response) {
        response.on("data", function(data){
            const locData = data.toString()         
            const data_loc = JSON.parse(locData)
            // console.log(data_loc)
            const longitude = (data_loc.data.longitude)
            const latitude = (data_loc.data.latitude)
            console.log(data_loc.data.longitude + ' ' + data_loc.data.latitude)
            res.send(data_loc);
        })
    });
    const police_api_url = "https://data.police.uk/api/crimes-at-location?date=" + date + "&lat=" + '' + "&lng=" + '';
    console.log(police_api_url);
    https.get(police_api_url, function(resp) {
        resp.on("police_data", function(police_data){
            const PData = JSON.parse(police_data);
            console.log(PData);      
        })
    })   
})


app.listen(process.env.PORT || 3000, function() {
    console.log("Server listening");
});

