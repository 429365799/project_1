
module.exports = app => {
    return new Handler(app);
}

class Handler {

    constructor(app) {
        this.app = app;
    }

    /**
     * 添加发言
     * @param {*} msg {
     *  content string 消息内容
     *  target string 发送目标，如果不传就是发送给该房间所有人
     * }
     * @param {*} session 
     * @param {*} next 
     */
    addSpeak(msg, session, next) {
        console.log(msg);
        console.log('session uid ---- ', session.uid);

        next(null);
    }
}
