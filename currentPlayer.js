var request = require('request');
function  getCurrentPlayer(item,cb) {
    var appid = item['data-ds-appid'];
    var steamapi = null;
    var options = {
        url: 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid='+appid,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0'
        }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            // console.log(body);
            cb(null,info['response']['player_count']);
        }
    }

   request(options, callback);
//    return steamapi;

}

module.exports = getCurrentPlayer;