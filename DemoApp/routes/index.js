var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var redisClient = req.app.get('redisClient');
  var version = req.app.get('appVersion');
  
  redisClient.incr('counter', function(err, counter) {
    if(err) return next(err);
    
    res.render('index', { viewCount: counter, appVersion: version, user: req.user });
  });
});

module.exports = router;
