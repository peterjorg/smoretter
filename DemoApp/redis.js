var redis = require('redis');
var redisClient = redis.createClient('6379', 'redis');

redisClient.on('connect', function() {
  console.log('Redis connected.');  
});

module.exports = redisClient;