//starting backend naming our middleware and tools
var express = require("express");
var mongodb = require("mongodb");
var cors = require("cors");
var bp = require("body-parser");
var unirest = require('unirest');
var request = require("request");
//var ObjectID = mongodb.ObjectID;
PORT = process.env.PORT || 3000;
//UNOGS KEY
var UNOG_SKEY = process.env.UNOGS_KEY;

//naming the collection to store the database
var NETFLIX_N_CHILL_COLLECTION = "netflix";
//setting app variable to express
var app = express();
//nominating the express tools to use such as body-parser and cors
//body parser translates our data cors will allow cross origin sync
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cors());
//connecting mongo server to database, port 27017 also adding error handling which
//starts after url line
// var url = 'mongodb://localhost:27017/netflix_project'; //local testing
var url = 'mongodb://heroku_h7pzl3ch:16rnh913p50naacq4n3oibq2r@ds029705.mlab.com:29705/heroku_h7pzl3ch' //production
//port that we will use mongo
mongodb.MongoClient.connect(process.env.MONGODB_URI || url, function(err, database) {

    //naming our database
    db = database;
    console.log('DATABASE IS PUMPING');
    //Starting server with express //these are heroku routes
    // var server = app.listen(process.env.PORT || 3000, function(){
    //     var port = server.address().port;
    //     console.log("RUNNING THE APP ON PORT", port)
    // });

});
//starting backend api calls and front end also error handling
//HARD PART
//We need to GET searches from API to save them
//We need to create new events to our database


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
// app.get("/netflix/new", function(res, req) {
//
//     // find all contacts and return them as an array
//     db.collection(NETFLIX_N_CHILL_COLLECTION).find({}).toArray(function(err, docs) {
//         if (err) {
//             handleError(res, err.message, "Couldn't get Chill movies");
//         } else {
//             res.status(200).json(docs);
//         }
//     });
// });
//
// });
app.post("/netflix/new", function(req, res) {

    var newMovie = req.body
    console.log(newMovie)
    console.log(typeof newMovie)
    // insert one new contact
    db.collection(NETFLIX_N_CHILL_COLLECTION).insertOne(newMovie, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to create new contact.");
        } else {
            res.status(201).json(doc.ops[0]);
        }
    });
});

app.listen(PORT, function(){
    console.log('listen to events on a "port: ', PORT)
});