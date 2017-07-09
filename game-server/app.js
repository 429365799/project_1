const pomelo = require('pomelo')
const routes = require('./app/utils/routeConfig');


/**
 * Init app for client.
 */
const app = pomelo.createApp()
app.set('name', 'project_1');

// 配置push缓冲策略
app.set('pushSchedulerConfig', {
    scheduler: pomelo.pushSchedulers.buffer,
    flushInterval: 20,
});

// connector configuration
// app.configure('production|development', 'connector', () => {
//     app.set('connectorConfig',
//         {
//             connector: pomelo.connectors.sioconnector,
//             // 'websocket', 'polling-xhr', 'polling-jsonp', 'polling'
//             transports: ['websocket', 'polling'],
//             heartbeats: 4,
//         }
//     );
// });

// // gate configuration
// app.configure('production|development', 'gate', () => {
//     app.set('connectorConfig', {
//         connector: pomelo.connectors.sioconnector,
//         transports: ['websocket', 'polling']
//     });
// });

// // chat configuration
// app.configure('production|development', 'chat', () => {
    
// });

// global app configure
app.configure('production|development', function() {
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

// start app
app.start()

process.on('uncaughtException', function (err) {
    console.error(' Caught exception: ' + err.stack)
})
