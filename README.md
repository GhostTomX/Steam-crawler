# 一个用nodejs来爬取Steam平台数据的爬虫

## 初衷：

本人一直比较关注独立游戏的制作，平时玩的游戏也主要以独立游戏为主。到目前为止，并没有适合开发者来获得各大游戏数据的平台，包括作者信息，影响力分数，优秀作品集等等。突然想知道独立游戏每段时间内的上架数目，索性觉得就把所有数据都爬下来看看。

## 数据来源

http://store.steampowered.com/search/?sort_by=Released_DESC

https://wiki.teamfortress.com/wiki/User:RJackson/StorefrontAPI#Known_methods

https://developer.valvesoftware.com/wiki/Steam_Web_API

http://www.rubydoc.info/github/YusefOuda/steam-api/SteamApi/ISteamUserStats

https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=617560

http://api.steampowered.com/ISteamWebAPIUtil/GetSupportedAPIList/v0001/?format=json

## 类似功能网站

https://steamdb.info/

http://steamgraph.net/index.php

## 项目展示地址

http://steamshop.info/


## 目标：

- 为了了解最新的游戏资讯

- 熟悉nodejs

   打算长期维护这个数据，欢迎查阅。

## 外部依赖项

- [superagent](http://visionmedia.github.io/superagent/)：发出request,设定http的header
- [cheerio](https://github.com/cheeriojs/cheerio)：包装http返回的html内容成对象（类json文件）
- [Mongodb](https://www.mongodb.com/)：数据库
- [Async](https://github.com/caolan/async)：控制并发数量与异步结果


## Change log

### v0.13  （2016.04.22）

- 使用异步重写了函数
- 增加了Async来管理并发数量与爬取速度

### v0.12  （2016.04.17）

- 增加了发起请求的延时，现在不会再出现因为查询过频繁而被ban的情况了

### v0.11  （2016.04.16）

- 增加了针对ip暂时被steam ban的错误处理：等待30mins后再次尝试。
- 增加了针对游戏的时间有时候找不到的错误处理，等待半秒再次尝试，若再次失败则输入“data error”

### v0.10  （2016.04.16）

- 完成crawler主体

- 爬到到今天为止所有上架的游戏的数据数据到data中

- 栏位

      "_id" : ObjectId("58f32f37bcede637acc0ee03"),//mongodb id
      "href" : "http://store.steampowered.com/app/499460/?snr=1_7_7_230_150_1",
      "data-ds-appid" : "571490",//steam id
      "spic" : "http://cdn.steamstatic.com.8686c.com/steam/apps/571490/capsule_sm_120.jpg?t=1492020876",// 缩略图
      "title" : "Tomato Jones Demo",
      "date" : "2017年4月16日",
      "price" : "\r\n\t\t\t\t\t\t\t\t免费试用版\t\t\t\t\t\t\t"

## 注意事项：

- 有一些demo版本虽然能爬到但是浏览器端不会显示
- 和我之前爬过的google还有wiki相比，steam针对爬虫的频率限制明显更严格一些，等待时间要适当拉长。


