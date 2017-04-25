var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost/Steam_data';
var threadCount = 0;//设定并发数量
// var steamAPI = require('./steamAPI');
console.log('爬虫程序开始运行......');

MongoClient.connect(url, function (err, db) {
    console.log('数据库已链接');
    var j = 0;
    lastPage = "";
    // for(var jout = 0,j<1020;jout++){
    var jpool = [];
    for (; j < 5; j++) {
        jpool.push(j);
    }
    async.mapLimit(jpool, 1, req, function (err, results) {
        if (err) {
            console.log(err);
        }
        for (i in results) {
            getSigRes(results[i]);
        }

    });

});

function getSigRes($) {
    var maxOnePage = $(".search_result_row").length;
    var ipool = [];
    for (var i = 0; i < maxOnePage; i++) {
        var ele = [i, $];
        // console.log(ele);
        ipool.push(ele);
    }
    // console.log("typeofip    "+typeof ipool);
    async.mapLimit(ipool, 1, SigRes, function (err, results) {
        // console.log(results[0]);
        getsteamapi(results);



    });
};


function getsteamapi(datagroup) {
    console.log("typeof" + typeof datagroup);

    // console.log("---"+datagroup.length)
    async.mapLimit(datagroup, 1, steamapi, function (err, datagroupapi) {
        // console.log("back---"+datagroupapi.length);
    })
}

function SigRes(ele, cb) {
    var i = ele[0];
    var $ = ele[1];
    // console.log(i);
    try {
        console.log("data///" + i);
        var data = $(".search_result_row")[0].attribs;//异步的的原因又可以变回i  异步每一次的tree都是新的
        data.spic = $(".search_result_row")[0].children[1].children[0].attribs.src;//最新的需要填充的。//这里是获得小图
        data.title = $(".title")[i].children[0].data;//标题i保持不变.名称
        data.price = $(".search_price")[i].children[0].data;//价格
        data.date = $(".search_released")[i].children[0].data;//发行日期
        delete (data.onmouseover);
        delete (data.onmouseout);
        delete (data.class);
    } catch (err) {
        cb(null, null);
        console.log(err);
        // data.date = '发生错误';
        return;
    }
    // console.log("getiddata" + data);
    cb(null, data);

}

function req(j, callback) {
    threadCount++;
    superagent
        .get('http://store.steampowered.com/search/?sort_by=Released_DESC' + '&page=' + j)
        // .get('www.baidu.com')
        .set('Accept', "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
        .set('Accept-Language', 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3')
        .set('Cookie', '"browserid=1297440460353087890; recentapps=%7B%22464530%22%3A1492320918%2C%22613730%22%3A1492320465%2C%22564210%22%3A1492319614%2C%22433850%22%3A1492311814%2C%22385760%22%3A1492241884%2C%22376680%22%3A1490078930%7D; timezoneOffset=28800,0; _ga=GA1.2.124183404.1490078932; steamCountry=TW%7C5f0cc28f6f07b6ec7e10b8fee97a6af1; sessionid=47156200c04fa5766793165b; steamLogin=76561198101463704%7C%7CF68245F797E62896DBB0D240588C2931DC34D7E6; app_impressions=578000@1_7_7_230_150_1|586320@1_7_7_230_150_1|607020@1_7_7_230_150_1|610860@1_7_7_230_150_1|613730@1_7_7_230_150_1|521790@1_7_7_230_150_1|407310@1_7_7_230_150_1|619220@1_7_7_230_150_1|569130@1_7_7_230_150_1|610940@1_7_7_230_150_1|571490@1_7_7_230_150_1|603250@1_7_7_230_150_1|624360@1_7_7_230_150_1|464530@1_7_7_230_150_1|468721@1_7_7_230_150_1|621530@1_7_7_230_150_1|544400@1_7_7_230_150_1|586320@1_7_7_230_150_1|607020@1_7_7_230_150_1|619220@1_7_7_230_150_1|569130@1_7_7_230_150_1|571490@1_7_7_230_150_1|578000@1_7_7_230_150_1|586320@1_7_7_230_150_1|607020@1_7_7_230_150_1|610860@1_7_7_230_150_1|613730@1_7_7_230_150_1|521790@1_7_7_230_150_1|407310@1_7_7_230_150_1|619220@1_7_7_230_150_1|569130@1_7_7_230_150_1|610940@1_7_7_230_150_1|571490@1_7_7_230_150_1"')
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0')
        .end(function (err, res) {

            // getid(res,callback)
            $ = cheerio.load(res.text);
            try {
                lastPage = $("#search_result_container")[0].children[5].children[0].data;
            } catch (error) {
                callback(null, null);
                threadCount--;
                return;
            }

            if ((lastPage === "该查询未传回任何结果。")) {
                console.log(j + "该查询未传回任何结果");
                callback(null, null);
                threadCount--;
                return;

            }
            // var maxOnePage = $(".search_result_row").length;
            console.log("--------------------------第" + j + "页完成,当前并发数" + threadCount);
            j++;
            threadCount--;
            // var resul = [maxOnePage,]
            // callback(null, maxOnePage, $);
            callback(null, $);
        });
}
// });


function steamapi(data, cb) {
    appid = data['data-ds-appid'];
    console.log(appid);
    var request = require('request');
    // var steamapi = null;
    var options = {
        url: 'http://store.steampowered.com/api/appdetails/?appids=' + appid,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0'
        }
    };
    request(options, function (err, response, body) {
        if (err) {
            console.log(err);
        }
        if (!err && response.statusCode == 200) {
            try {
                var info = JSON.parse(body);
                // console.log(info[appid]);}
            }
            catch (err) {
                try {
                    var info = JSON.parse(body);
                }
                catch (err) {
                    cb(null, null)
                }
            }
            data.type = info[appid].data.type;
            cb(null, data);
        }
    });

}

