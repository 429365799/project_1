
module.exports = function (app) {
    return new ChatRemote(app);
}

class ChatRemote {

    constructor(app) {
        this.app = app;
        this.channelService = app.get('channelService');

        this.addUser = this.addUser.bind(this);
        this.getChannelUsers = this.getChannelUsers.bind(this);
        this.kickUser = this.kickUser.bind(this);
    }

    /**
     * 添加用户到channel
     * @param {string} channelName 
     * @param {boolean} createChannel 是否创建channel
     * @param {string} uid uid
     * @param {string} sid server id
     * @param {function} cb 添加完成后的回调
     */
    addUser(channelName, createChannel, uid, sid, cb) {
        const channel = this.channelService.getChannel(channelName, createChannel);
        channel.pushMessage({
            route: 'onAddUser',
            username: uid.split('--')[0]
        });

        // 如果拿到channel
        if (!!channel) {
            channel.add(uid, sid);
        }

        cb(this.getChannelUsers(channelName, createChannel));
    }

    /**
     * 踢出channel
     * @param {string} uid session uid
     * @param {string} sid server id
     * @param {string} name channel name
     * @param {function} cb callback
     */
    kickUser(uid, sid, channelName, cb) {
        const channel = this.channelService.getChannel(channelName, false);

        if (!!channel) {
            channel.leave(uid, sid);
        }

        channel.pushMessage({
            route: 'onLeave',
            user: uid.split('--')[0]
        });

        cb();
    }

    /**
     * 根据channel下的所有user name
     * @param {string} channelName channel name
     * @param {boolean} createChannel 如果没有这个channel是否创建
     */
    getChannelUsers(channelName, createChannel) {
        const channel = this.channelService.getChannel(channelName, createChannel);
        let users = [];

        if (!!channel) {
            users = channel.getMembers();
        }

        return users.map(item => item.split('--')[0]);
    }
}
