// var search = require('./search');
var async = require('async');
function main(){
    // var arr = [1];
    // console.log("main");
    // // async.each()
    // var tasks = [function(){console.log("main---")},function(){console.log("main---")},function(){console.log("main---")}];

    // async.series(tasks,function(){console.log("main-121--")});
    // console.log("main-///");

console.log(typeof(search));



async.series([
    function(callback){
        console.log("1");
        callback(null, 'one');
    },
    function(callback){
       console.log("2");
        callback(null, 'two');
    },
        function(callback){
      
        callback(null, 'three');
    },
    search,
     function(cb){
        //  search
       console.log(cb);
        cb(null, 'four');}
],
// optional callback
function(err, results){
    // results is now equal to ['one', 'two']
    console.log(results);
});




}

function search(callback,results){
    console.log(results);
    callback(null,"ssdsadsas");
}



// search(function(cb){cb});
main();

