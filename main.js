var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost/Steam_data';
console.log('爬虫程序开始运行......');
MongoClient.connect(url, function (err, db) {
    console.log('数据库已链接');
    superagent
        .get('http://store.steampowered.com/search/?sort_by=Released_DESC')
        .set('Accept', "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
        .set('Accept-Language', 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3')
        // .set('Cookie','browserid=1297440460353087890; recentapps=%7B%22464530%22%3A1492320918%2C%22613730%22%3A1492320465%2C%22564210%22%3A1492319614%2C%22433850%22%3A1492311814%2C%22385760%22%3A1492241884%2C%22376680%22%3A1490078930%7D; timezoneOffset=28800,0; _ga=GA1.2.124183404.1490078932; steamCountry=TW%7C5f0cc28f6f07b6ec7e10b8fee97a6af1; sessionid=47156200c04fa5766793165b; steamLogin=76561198101463704%7C%7CF68245F797E62896DBB0D240588C2931DC34D7E6; app_impressions=578000@1_7_7_230_150_1|586320@1_7_7_230_150_1|607020@1_7_7_230_150_1|610860@1_7_7_230_150_1|613730@1_7_7_230_150_1|521790@1_7_7_230_150_1|407310@1_7_7_230_150_1|619220@1_7_7_230_150_1|569130@1_7_7_230_150_1|610940@1_7_7_230_150_1|571490@1_7_7_230_150_1|603250@1_7_7_230_150_1|624360@1_7_7_230_150_1|464530@1_7_7_230_150_1|468721@1_7_7_230_150_1|621530@1_7_7_230_150_1|544400@1_7_7_230_150_1|586320@1_7_7_230_150_1|607020@1_7_7_230_150_1|619220@1_7_7_230_150_1|569130@1_7_7_230_150_1|571490@1_7_7_230_150_1|578000@1_7_7_230_150_1|586320@1_7_7_230_150_1|607020@1_7_7_230_150_1|610860@1_7_7_230_150_1|613730@1_7_7_230_150_1|521790@1_7_7_230_150_1|407310@1_7_7_230_150_1|619220@1_7_7_230_150_1|569130@1_7_7_230_150_1|610940@1_7_7_230_150_1|571490@1_7_7_230_150_1')
        //由于我是本人在台湾，而我又想要国内的价格（以及单位等等），所以我使用了我自己的浏览器cookies。建议更改，对我来说有安全隐患。
        .set('Cookie', 'steamCountry=TW%7C5f0cc28f6f07b6ec7e10b8fee97a6af1; browserid=1300820690922203475; sessionid=25c3676462c91121b13595ec; steamLogin=76561198101463704%7C%7CF68245F797E62896DBB0D240588C2931DC34D7E6; timezoneOffset=28800,0; _ga=GA1.2.2093120209.1492323461; app_impressions=578000@1_7_7_230_150_1|586320@1_7_7_230_150_1|607020@1_7_7_230_150_1|610860@1_7_7_230_150_1|613730@1_7_7_230_150_1|521790@1_7_7_230_150_1|407310@1_7_7_230_150_1|619220@1_7_7_230_150_1|569130@1_7_7_230_150_1|610940@1_7_7_230_150_1|533200@1_7_7_230_150_1|571490@1_7_7_230_150_1|578000@1_7_7_230_150_1|586320@1_7_7_230_150_1|607020@1_7_7_230_150_1|610860@1_7_7_230_150_1|613730@1_7_7_230_150_1|521790@1_7_7_230_150_1|407310@1_7_7_230_150_1|619220@1_7_7_230_150_1|569130@1_7_7_230_150_1|610940@1_7_7_230_150_1|533200@1_7_7_230_150_1|571490@1_7_7_230_150_1|578000@1_7_7_230_150_1|586320@1_7_7_230_150_1|607020@1_7_7_230_150_1|610860@1_7_7_230_150_1|613730@1_7_7_230_150_1|521790@1_7_7_230_150_1|407310@1_7_7_230_150_1|619220@1_7_7_230_150_1|569130@1_7_7_230_150_1|610940@1_7_7_230_150_1|533200@1_7_7_230_150_1|571490@1_7_7_230_150_1|622570@1_7_7_230_150_1|578000@1_7_7_230_150_1|586320@1_7_7_230_150_1|607020@1_7_7_230_150_1|610860@1_7_7_230_150_1|613730@1_7_7_230_150_1|521790@1_7_7_230_150_1|407310@1_7_7_230_150_1|619220@1_7_7_230_150_1|569130@1_7_7_230_150_1|610940@1_7_7_230_150_1|571490@1_7_7_230_150_1')
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0')
        .end(function (err, res) {
            ///
            $ = cheerio.load(res.text);
            try {
                maxPage = Number($(".search_pagination_right")[0].children[5].children[0].data);
                // maxPage=5;
            } catch (error) {
                console.log("Access deneied wait for 30min");
                // maxPage=5;
                // pass
                mySetTimeout(360000);
                maxPage = Number($(".search_pagination_right")[0].children[5].children[0].data);
            };
            n = 1;
            // for(var j = 2;j<maxPage+1;j++){
            for (var j = n; j < maxPage + 1; j++) {
                superagent
                    .get('http://store.steampowered.com/search/?sort_by=Released_DESC' + '&page=' + j)
                    .set('Accept', "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
                    .set('Accept-Language', 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3')
                    .set('Cookie', '"browserid=1297440460353087890; recentapps=%7B%22464530%22%3A1492320918%2C%22613730%22%3A1492320465%2C%22564210%22%3A1492319614%2C%22433850%22%3A1492311814%2C%22385760%22%3A1492241884%2C%22376680%22%3A1490078930%7D; timezoneOffset=28800,0; _ga=GA1.2.124183404.1490078932; steamCountry=TW%7C5f0cc28f6f07b6ec7e10b8fee97a6af1; sessionid=47156200c04fa5766793165b; steamLogin=76561198101463704%7C%7CF68245F797E62896DBB0D240588C2931DC34D7E6; app_impressions=578000@1_7_7_230_150_1|586320@1_7_7_230_150_1|607020@1_7_7_230_150_1|610860@1_7_7_230_150_1|613730@1_7_7_230_150_1|521790@1_7_7_230_150_1|407310@1_7_7_230_150_1|619220@1_7_7_230_150_1|569130@1_7_7_230_150_1|610940@1_7_7_230_150_1|571490@1_7_7_230_150_1|603250@1_7_7_230_150_1|624360@1_7_7_230_150_1|464530@1_7_7_230_150_1|468721@1_7_7_230_150_1|621530@1_7_7_230_150_1|544400@1_7_7_230_150_1|586320@1_7_7_230_150_1|607020@1_7_7_230_150_1|619220@1_7_7_230_150_1|569130@1_7_7_230_150_1|571490@1_7_7_230_150_1|578000@1_7_7_230_150_1|586320@1_7_7_230_150_1|607020@1_7_7_230_150_1|610860@1_7_7_230_150_1|613730@1_7_7_230_150_1|521790@1_7_7_230_150_1|407310@1_7_7_230_150_1|619220@1_7_7_230_150_1|569130@1_7_7_230_150_1|610940@1_7_7_230_150_1|571490@1_7_7_230_150_1"')
                    .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0')
                    .end(function (err, res) {
                        $ = cheerio.load(res.text);
                        var maxOnePage = $(".search_result_row").length;
                        for (var i = 0; i < maxOnePage; i++) {//犯的错误 直接引用了  $(".search_result_row").length。 实际上由于我的删除动作这个值一直在减少
                            var data = $(".search_result_row")[0].attribs;//注意： 由于class属性是我不需要的，所以我在后文将其删除。因此每次查询得到的最新的一个$(".search_result_row") 就是 // 获得href,appid
                            data.spic = $(".search_result_row")[0].children[1].children[0].attribs.src;//最新的需要填充的。//这里是获得小图
                            data.title = $(".title")[i].children[0].data;//标题i保持不变.名称
                            try {
                                data.date = $(".search_released")[i].children[0].data;//发行日期
                            } catch (error) {
                                mySetTimeout(5000);
                                try {
                                    data.date = $(".search_released")[i].children[0].data;
                                } catch (error) {
                                    console.log("data error");
                                    data.date = '发生错误';
                                }
                            }
                            data.price = $(".search_price")[i].children[0].data;//价格
                            delete (data.onmouseover);
                            delete (data.onmouseout);
                            delete (data.class);

                            // console.log(data);
                            db.collection("steam_info_2").insert(data);
                        };
                        mySetTimeout(5000);

                        console.log("第" + n + "页完成，总共" + maxPage + "页");
                        if (n === maxPage) {
                            db.close();
                        };
                        n = n + 1;
                    });
            };
        });
});

function mySetTimeout(ms) {
    var currentTime = new Date().getTime();
    while (new Date().getTime() < currentTime + ms);
}
