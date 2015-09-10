var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var redisClient = req.app.get('redisClient');
  redisClient.incr('counter', function(err, counter) {
    if(err) return next(err);
    res.render('index', { viewCount: counter });
  });
});

module.exports = router;
