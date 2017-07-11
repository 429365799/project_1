const pomelo = require('pomelo')
const routes = require('./app/utils/routeConfig');
const redisClient = require('./app/dao/redis/redisConnection');
const mysqlClient = require('./app/dao/mysql/dbUtils');

/**
 * Init app for client.
 */
const app = pomelo.createApp()

app.set('name', 'project_1');

app.set('redis', redisClient());

// 配置push缓冲策略
app.set('pushSchedulerConfig', {
    scheduler: pomelo.pushSchedulers.buffer,
    flushInterval: 20,
});

// global app configure
app.configure('production|development', function() {
	// load mysql config
	app.loadConfig('mysql', app.getBase() + '/config/mysql.json');

	// route configures
	app.route('chat', routes.chat);

	app.set('connectorConfig', {
		connector: pomelo.connectors.sioconnector,
		// 'websocket', 'polling-xhr', 'polling-jsonp', 'polling'
		transports: ['websocket', 'polling'],
		heartbeats: true,
		closeTimeout: 60 * 1000,
		heartbeatTimeout: 60 * 1000,
		heartbeatInterval: 25 * 1000
	});

	// filter configures
	app.filter(pomelo.timeout());
});

app.configure('production|development', 'chat', function() {
	const mysqlConn = mysqlClient(app);
	app.set('mysql', mysqlConn);
});


// start app
app.start()

process.on('uncaughtException', function (err) {
    console.error(' Caught exception: ' + err.stack)
})
