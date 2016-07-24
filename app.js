//starting backend naming our middleware and tools
var express = require("express");
var mongodb = require("mongodb");
var cors = require("cors");
var bp = require("body-parser");
var unirest = require('unirest');
var md5 = require("md5");
var nodemon = require("nodemon");
var request = require("request");
var ObjectID = mongodb.ObjectID;
//UNOGS KEY
var UNOG_SKEY = process.env.UNOGS_KEY;
//setting app variable to express
var app = express();
//nominating the express tools to use such as body-parser and cors
//body parser translates our data cors will allow cross origin sync
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cors());
//connecting mongo server to database, port 27017 also adding error handling which
//starts after url line
var url = "mongodb://heroku_4jfc377n:7qdf5pdcofimdgror03ta398vp@ds029735.mlab.com:29735/heroku_4jfc377n";
//var url = 'mongodb://localhost:27017/netflix'//also translates to mongoURL
// port that we will use mongo
var MongoClient = mongodb.MongoClient;

//HARD PART
//We need to GET searches from API to save them
//We need to create new events to our database
// app.get('/', function(request, response){
// response.json({"description": "netFlix API"});
// });

app.post('/netflix/search', function(req, res) {//for this to work REQ is before RES
    var inputValue = req.body.input;
    unirest.get("https://unogs-unogs-v1.p.mashape.com/api.cgi?q=" + inputValue + "-!1900,2017-!0,5-!0,10-!0-!Any-!Any-!Any-!gt100&t=ns&cl=all&st=adv&ob=Relevance&p=1&sa=and")
        .header("X-Mashape-Key", UNOG_SKEY)
        .header("Accept", "application/json")
        .end(function (result) {
            console.log(result.status, result.headers, result.body);
            res.send(result.body);
            console.log(res.send)
        })
});

// app.get('netflix/list', function(requeset, response){
//     MongoClient.connect(mongoUrl, function(err, db){
//         var netflixCollection = db.collection('netflix');
//         if (err){
//             console.log('Unable to connect to the mongoDB server. ERROR:', err);
//         }else if(result.length){
//             console.log('Founc:', result);
//             response.json(result);
//         }else{
//             console.log('No documents found');
//             response.json('no movies found')
//         }
//         db.close(function(){
//             console.log("database Closed");
//         });
//     })
// })

PORT = process.env.PORT || 80;

app.listen(PORT, function(){
    console.log('listening to events on a "port".')
});