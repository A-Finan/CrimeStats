const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");
const lib = require("./functions/methods.js");
const zlib = require("zlib");

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

longitude = [];
latitude = [];
date = []; 

app.get('/', function(req, res){
    res.render("pages/main.ejs");
    longitude = [];
    latitude = [];
    date = []; 
})


app.post('/search', function(req, res) {
    const postcode = req.body.pcodeSearch
    console.log(postcode);
    // const date = req.body.dateSearch
    date.push(req.body.dateSearch);
    console.log(req.body.dateSearchte);
    const location_api_url = "https://api.getthedata.com/postcode/" + postcode;
    // console.log(location_api_url)
    https.get(location_api_url, function(response) {
        response.on("data", function(data){
            const locData = data.toString(); 
            const data_loc = JSON.parse(locData);
            console.log(data_loc);
            longitude.push(data_loc.data.longitude);
            latitude.push(data_loc.data.latitude);
            console.log(data_loc.data.longitude + ' ' + data_loc.data.latitude);
            
            getGzipped("https://data.police.uk/api/crimes-street/all-crime?lat=" + latitude + "&lng=" + longitude + "&date=" + date, function(err, data) {
                console.log(data);})
        });
    });
});



function getGzipped(url, callback) {
    // buffer to store the streamed decompression
    var buffer = [];

    https.get(url, function(res) {
        // pipe the response into the gunzip to decompress
        var gunzip = zlib.createGunzip();            
        res.pipe(gunzip);

        gunzip.on('data', function(data) {
            // decompression chunk ready, add it to the buffer
            buffer.push(data.toString())

        }).on("end", function() {
            // response and decompression complete, join the buffer and return
            callback(null, buffer.join("")); 

        }).on("error", function(e) {
            callback(e);
        })
    }).on('error', function(e) {
        callback(e)
    });
}


// app.get('/police-api', function(req, resp1) {
//     var buffer = [];

//     const police_api_url = "https://data.police.uk/api/crimes-street/all-crime?lat=" + latitude + "&lng=" + longitude + "&date=" + date;
//     console.log(police_api_url);
//     https.get(police_api_url, function(resp) {
//         const gunzip = zlib.createGunzip();            
//         resp.pipe(gunzip);
//         gunzip.on('data', function(data) {
//             // decompression chunk ready, add it to the buffer
//             buffer.push(data.toString())

//         }).on("end", function() {
//             // response and decompression complete, join the buffer and return
//             callback(null, buffer.join("")); 
    
//         // resp.on("police_data", function(police_data){
//         //     popo = decompressResponse(police_data)
//         //     console.log(popo);
//         //     const police_data_json = popo.toString();
//         //     console.log(police_data_json);
//         //     const PData = JSON.parse(police_data_json);
//         //     console.log(PData);
//         //     res.render("pages/main.ejs");      
//         // })
//         })   
//     })
// });



app.listen(process.env.PORT || 3000, function() {
    console.log("Server listening");
});

