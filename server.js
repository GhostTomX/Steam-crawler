var http = require('http');
var fs = require('fs');
var getsteamapi = require('./steamAPI');
var searchAppId = require("./search.js");
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var url = 'mongodb://localhost/Steam_data';

dbname = searchAppId.name;
// console.log(dbname);

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
                steamapi(items, res);
            }
        );
    }

    function steamapi(items, res) {
        async.mapLimit(items, 1, getsteamapi, function (err, results) {
            getTemplate(items, results, res);
        })
    }

    function getTemplate(items, results, res) {
        fs.readFile('./template.html', function (err, data) {
            if (err) return hadError(err, res)
            formatHtml(items, results, data.toString(), res)
        })
    }


    function formatHtml(items, apiresults, tmpl, res) {
        var contextchanged = "";
        var IndCoun = 0;
        for (var i = 0; i < items.length; i++) {
            // var IndCoun = 0;
            // contextchanged+=items[i]['data-ds-appid'].toString();
            for (var j = 0; j < apiresults[i].genres.length; j++) {

                console.log(IndCoun);
                if ((apiresults[i].genres[j]['id'].toString() === '23') && (IndCoun < 10)) {
                    contextchanged += items[i]['data-ds-appid'].toString();
                    contextchanged += apiresults[i].name.toString();
                    contextchanged += apiresults[i].genres[j]['description'].toString();
                    IndCoun++;

                }
                else {
                    if (IndCoun === 10) {
                        break;
                    }
                }
            }
            contextchanged += "</h1><h1>";
            if (IndCoun === 10) {break;}
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