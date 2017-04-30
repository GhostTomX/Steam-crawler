
var request = require('request');
function  getsteamapi(item,cb) {
    var appid = item['data-ds-appid'];
    var steamapi = null;
    var options = {
        url: 'http://store.steampowered.com/api/appdetails/?appids='+appid,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0'
        }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            // console.log(body);
            cb(null,info[appid].data);
        }
    }

   request(options, callback);
//    return steamapi;

}

module.exports = getsteamapi;