const poolUtil = require('./mysqlConnection');

module.exports = (app) => {
    return new Connection(app);
}

class Connection {

    constructor(app) {
        this.app = app;

        this.init();
    }

    init() {
        this.pool = poolUtil(this.app);
    }

    /**
     * 
     * @param {string} sql 查询语句
     * @param {array} args 参数列表
     * @param {function?} cb 查询回调
     * 
     */
    query(sql, args, cb) {
        return this.pool.acquire()
            .then(client => {
                return new Promise((resolve, reject) => {
                    client.query(sql, args, (error, results, fields) => {
                        if (cb) {
                            cb(error, results, fields);
                        }

                        if (error) {
                            reject(error);
                        } else {
                            resolve(results);
                        }
                    });
                });
            })
    }

}
