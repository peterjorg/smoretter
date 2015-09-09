var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  
    var redisClient = req.app.get('redisClient');
  redisClient.set('KEY', "SampleValue!!");
 
  redisClient.get('KEY', function(err, reply) {
   res.send('from redis: ' + reply);
});
 
});

module.exports = router;