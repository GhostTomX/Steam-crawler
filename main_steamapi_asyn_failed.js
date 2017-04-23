var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost/Steam_data';
var threadCount = 0;//设定并发数量
var steamAPI = require('./steamAPI');
console.log('爬虫程序开始运行......');

MongoClient.connect(url, function (err, db) {
    console.log('数据库已链接');
    var j = 1060;
    lastPage = "";
    var jpool = [];
    for (; j < 1070; j++) {
        jpool.push(j);
    }
    async.mapLimit(jpool, 5, function (j, cb) {
        req(j, cb);
    }, function (err, results) {
        console.log("结束");
        console.log(results);
    });

    function mySetTimeout(ms) {
        var currentTime = new Date().getTime();
        while (new Date().getTime() < currentTime + ms);
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
                $ = cheerio.load(res.text);
                try {
                    lastPage = $("#search_result_container")[0].children[5].children[0].data;
                } catch (error) {
                    mySetTimeout(60 * 60 * 1000);
                }
                if ((lastPage === "该查询未传回任何结果。")) {
                    console.log(j + "该查询未传回任何结果");
                    return;

                }
                datagroup = [];
                var maxOnePage = $(".search_result_row").length;
                for (var i = 0; i < maxOnePage; i++) //犯的错误 直接引用了  $(".search_result_row").length。 实际上由于我的删除动作这个值一直在减少
                {
                   
                    // (function (i) {
                        try {
                            // var data = $(".search_result_row")[0].attribs;//注意： 由于class属性是我不需要的，所以我在后文将其删除。因此每次查询得到的最新的一个$(".search_result_row") 就是 // 获得href,appid
                            
                            var data = $(".search_result_row")[i].attribs;//异步的的原因又可以变回i  异步每一次的tree都是新的
                            data.spic = $(".search_result_row")[0].children[1].children[0].attribs.src;//最新的需要填充的。//这里是获得小图
                            data.title = $(".title")[i].children[0].data;//标题i保持不变.名称
                            data.price = $(".search_price")[i].children[0].data;//价格
                            try {
                                data.date = $(".search_released")[i].children[0].data;//发行日期
                                // console.log(data.date);
                            } catch (error) {
                                try {
                                    data.date = $(".search_released")[i].children[0].data;
                                } catch (error) {
                                    console.log("date data error");
                                    data.date = '发生错误';
                                }
                            }
                            // console.log("***" + data.title);
                        //     (function (data){
                        //     steamAPI(data['data-ds-appid'], function (steamapi) {
                        //         // console.log("***" +i );
                        //         data.type = steamapi.type;
                        //         console.log("///" + data.title);
                        //         delete (data.onmouseover);
                        //         delete (data.onmouseout);
                        //         delete (data.class);
                        //         // db.collection("steam_info_20170423_2").insert(data);

                        //     });
                        // })(data);
                        datagroup.push(data);
                        } catch (error) {

                            console.log("其他data发生错误");
                            console.log(error);
                            // return;
                        }
                    // })(i);
                };
                console.log(datagroup.length);
                var position = 0
                async.eachSeries(datagroup,function(data,cb){
                    steamAPI(data['data-ds-appid'], function (steamapi) {
                                position++;
                                data.type = steamapi.type;
                                console.log("process//" + j +"::"+position);
                                delete (data.onmouseover);
                                delete (data.onmouseout);
                                delete (data.class);
                                cb(err);
                                db.collection("steam_info_20170423_2").insert(data);
                                
                }
            );},function(err){
                console.log(err);
            });

                mySetTimeout(100);
                console.log("--------------------------第" + j + "页完成,当前并发数" + threadCount);
                j++;

                threadCount--;
                callback(null, j);
            });
    }


});
