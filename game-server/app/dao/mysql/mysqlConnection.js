const pool = require('generic-pool');
const mysql = require('mysql');

module.exports = function createPool (app) {
    const mysqlConfig = app.get('mysql');

    const factory = {
        create: function() {
            return new Promise(function(resolve, reject){
                const client = mysql.createConnection({
                    host: mysqlConfig.host,
                    user: mysqlConfig.user,
                    password: mysqlConfig.password,
                    database: mysqlConfig.database
                });

                client.connect(err => {
                    if (err) {
                        console.error('mysql connect error: ', err);
                        reject(err);
                    } else {
                        console.log('mysql is connected id = ', client.threadId);
                        resolve(client);
                    }
                });
            })
        },
        destroy: function(client) {
            return new Promise(function(resolve){
                client.end();
                resolve();
            })
        }
    };

    const opts = {
        max: 10, // maximum size of the pool
        min: 5 // minimum size of the pool
    };

    return pool.createPool(factory, opts);
}
