var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('./credentials.js');

/* GET home page. */
//router.get('/', function(req, res) {
//  res.render('index', { title: 'Express' });
//});

var twitter = {};


twitter.accessToken = null;
twitter.getAccessToken = function(callback){
  if(twitter.accessToken == null)
  {
    var bearerCred = config.apiKey + ":" + config.apiSecret;
    bearerCred = new Buffer(bearerCred).toString('base64');
    bearerCred = "Basic " + bearerCred;
    //console.log(bearerCred);

    request.post('https://api.twitter.com/oauth2/token',
        {form: {grant_type:'client_credentials'},
         headers: {'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
                   'Authorization': bearerCred
                    }
        },
        function(err,res,body){
          if(!err && res.statusCode == 200){
            console.log(body);
            var obj = JSON.parse(body);
            twitter.accessToken = obj.access_token;
            console.log("Access Token fetched");
            callback();
          }
          else
          {
            console.log("Access Token Fetch failed");
          }
        });
  }
  else
  {
    callback();
  }
  
  return twitter.accessToken;
}
twitter.fetch = function(handle, fetchCallback){
    twitter.getAccessToken(callback);

    function callback()
    {
      var bearerToken = "Bearer "+ twitter.accessToken;
      request.get('https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name='+handle+'&count=200',
          { headers: {'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
                     'Authorization': bearerToken
                      }
          },
          function(err,res,body){
            if(!err && res.statusCode == 200){
              //console.log(body);
              var data = JSON.parse(body);
              fetchCallback(data);
            }
            else
            {
              console.log(body);
              console.log("Api call failed");
            }
          });
    }
}

/*index page*/
router.get('/timeline', function(req,res){
    var handle = req.query.handle;
    req.db.collection('handles').findOne({'handle' : handle},function(err,result){
      if(err) throw err;
      console.log("Result : " + result);
      if(result == null)
      { 
        twitter.fetch(handle, function(data){
          req.db.collection('handles').insert({'handle':handle, 'data':data},function(){});
          res.jsonp(data);
        });
      }
      else
      {
        console.log("Fetching from cache");
        res.jsonp(result.data);
      }
    });
});
module.exports = router;
