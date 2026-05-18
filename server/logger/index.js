var bunyan = require('bunyan'),
    config = require('../config');

module.exports =  bunyan.createLogger({
    name: config.serverName,
    streams: [
        {
            level: config.logLevel,
            stream: process.stdout,
        },
        {
            level: config.logLevel,
            path: config.logFileName
        }
    ]
});
