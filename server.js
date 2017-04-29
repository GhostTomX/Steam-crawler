var http = require('http');
var fs = require('fs');
var searchAppId = require("./search.js");
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost/Steam_data';

dbname = searchAppId.name;
console.log(dbname);

function serveron() {
    var server = http.createServer(function (req, res) {
        MongoClient.connect(url, function (err, db) {
            getids(res, db);
        })
    }).listen(80, "127.0.0.1");
    console.log("server on 127.0.0.1")

    function getids(res, db) {
        db.collection("steam_info_2017_04_29_1493461811975").find({ "date": "2017年4月29日" }, { "data-ds-appid": 1, "_id": 0 }).toArray(
            function (err, items) {
                getTemplate(items,res);
            }


        );
        // fs.readFile('./title.json',function(err,data){
        //     if(err) return hadError(err,res)
        //     getTemplate(JSON.parse(data.toString()),res);
        // })
        // res.end("111");
    }

    function getTemplate(items, res) {
        fs.readFile('./template.html', function (err, data) {
            if (err) return hadError(err, res)
            formatHtml(items, data.toString(), res)
        })
    }

    function formatHtml(items, tmpl, res) {
        var contextchanged = "";
        for(var i = 0;i<items.length;i++){
            // console.log(items[i]);
            contextchanged+=items[i]['data-ds-appid'].toString();
            contextchanged+="</h1><h1>";
        }
        var html = tmpl.replace('%', contextchanged);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    }

    function hadError(err, res) {
        console.log(err);
        res.end("Server Error");
    }
}

module.exports = serveron;