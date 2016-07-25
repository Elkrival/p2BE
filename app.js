//starting backend naming our middleware and tools
var express = require("express");
var mongodb = require("mongodb");
var cors = require("cors");
var bp = require("body-parser");
var unirest = require('unirest');
var nodemon = require("nodemon");
var request = require("request");
var ObjectID = mongodb.ObjectID;
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
var url = 'mongodb://localhost:27017/netflix_project';
// port that we will use mongo
mongodb.MongoClient.connect(process.env.MONGODB_URL || url, function(err, database){
    //error handling starts here
    if(err){
        console.log(err);
        process.exit(1)
    }
    //naming our database
    db = database;
    console.log('DATABASE IS PUMPING');
    //Starting server with express
    var server = app.listen(process.env.PORT || 3000, function(){
        var port = server.address().port;
        console.log("RUNNING THE APP ON PORT", port)
    });
});
//starting backend api calls and front end also error handling
function handleError(res, reason, message, code){
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error ": message});
}
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
app.get("netflix/new", function(res, req) {

    // find all contacts and return them as an array
    db.collection(NETFLIX_N_CHILL_COLLECTION).find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Couldn't get Chill movies");
        } else {
            res.status(200).json(docs);
        }
    });
});
app.post("netflix/new", function(req, res) {
    var movieObj = req.body.data;
    // insert one new contact
    db.collection(NETFLIX_N_CHILL_COLLECTION).insertOne(movieObj, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to create new contact.");
        } else {
            res.status(201).json(doc.ops[0]);
        }
    });
});

