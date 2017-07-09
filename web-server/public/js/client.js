var routes = {
    queryEntry: 'gate.gateHandler.queryEntry',
    enter: 'connector.entryHandler.enter',
}

var panelLogin = document.getElementById('panel-login');
var panelRoom = document.getElementById('panel-room');

function login () {
    var dom_username = document.getElementById('username');
    var dom_roomname = document.getElementById('room');

    var username = dom_username.value;
    var roomname = dom_roomname.value;

    queryEntry(username, function (host, port) {
        pomelo.init({
            host: host,
            port: port,
            log: true
        }, function () {
            pomelo.request(routes.enter, {
                username: username,
                rid: roomname,
            }, function (data) {
                console.log(data);
                showRoom();
            });
        });
    });
}

function queryEntry (uid, cb) {
    pomelo.init({
        host: '127.0.0.1',
        port: 4010,
        log: true
    }, function () {
        pomelo.request(routes.queryEntry, {
            uid: uid
        }, function (data) {
            pomelo.disconnect();

            console.log('connect result ', data);

            cb(data.host, data.port);
        });
    });
}

function showLogin () {
    panelLogin.style.display = 'block';
    panelRoom.style.display = 'none';
}

function showRoom () {
    panelLogin.style.display = 'none';
    panelRoom.style.display = 'block';
}