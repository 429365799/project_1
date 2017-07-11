const redis = require('redis');

module.exports = (opt = {}) => {
    const redisClient = redis.createClient(7676, '127.0.0.1', opt);

    redisClient.on("error", function (err) {///绑定redis数据库错误回调
        console.error("Redis:Error:" + err);
    });

    return redisClient;
};