module.exports = app => {
    return new Handler(app);
}

/**
 * 负责处理用户登录、离开、重连等逻辑
 */
class Handler {
    constructor(app) {
        this.app = app;
    }

    /**
     * 新用户进入
     * @param {object} msg 
     * @param {object} session
     * @param {function} next 
     */
    enter(msg, session, next) {
        const sessionService = this.app.get('sessionService');
        const username = msg.username;
        const rid = msg.rid;
        const uid = username + '---' + rid;
        const sid = this.app.get('serverId');
        const redis = this.app.get('redis');

        // redis.lpush('user', uid, (err, rep) => {
        //     console.log(err, rep);
        // });

        // 如果当前用户已经登录
        if (!!sessionService.getByUid(uid)) {
            next(null, {
                code: 500,
                msg: '当前用户已经登录',
                error: true,
            });
            return;
        }

        // 绑定当前用户到当前session
        session.bind(uid);
        // 设置房间id到当前的session中
        session.set('rid', rid);
        // 同步房间id到原始session
        session.push('rid', err => {
            if(err) {
                console.error('set rid for session service failed! error is : %j', err.stack);
            }
        });

        session.on('closed', arg => {
            this.app.rpc.chat.chatRemote.kickUser(session, uid, sid, rid, null);
        });

        // 将用户添加到channel
        this.app.rpc.chat.chatRemote.addUser(
            session,
            rid,
            true,
            uid,
            sid,
            users => {
                next(null, {
                    code: 200,
                    users: users
                });
            }
        );
    }
}
