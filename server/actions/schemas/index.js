var fs = require('fs'),
    path = require('path'),
    schemas = fs.readdirSync(__dirname),
    api = {};

schemas.splice(schemas.indexOf('index.js'), 1);

for (var i = 0; i < schemas.length; i++) {
    api[path.basename(schemas[i], '.js')] = require('./' + schemas[i]);
}

module.exports = api;