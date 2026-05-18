var http = require('http'),
    router = require('./router'),
    config = require('./config'),
    corsRoute = require('simple-cors'),
    port = config.port || 8080,
    server = http.createServer();

server.on('request', corsRoute(router.createHandler()));

server.listen(config.port);