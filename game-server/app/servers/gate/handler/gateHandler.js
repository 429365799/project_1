const dispatcher = require('../../../utils/dispatcher');

module.exports = app => {
    return new Handler(app);
}

/**
 * 计算负载均衡后选择出一个服务器，返回给前端调用
 */
class Handler {

    constructor(app) {
        this.app = app;

        this.queryEntry = this.queryEntry.bind(this);
    }

    /**
     * 分配连接给前端使用
     * @param {object} msg 
     * @param {object} session 
     * @param {function} next 
     */
    queryEntry(msg, session, next) {
        var uid = msg.uid;
        if(!uid) {
            next(null, {
                code: 500
            });
            return;
        }
        
        // 获取所有connector
        var connectors = this.app.getServersByType('connector');
        if(!connectors || connectors.length === 0) {
            next(null, {
                code: 500
            });
            return;
        }
        
        // 分配connector给前端调用
        var res = dispatcher.dispatch(uid, connectors);
        next(null, {
            code: 200,
            host: res.host,
            port: res.clientPort
        });
    }

}
