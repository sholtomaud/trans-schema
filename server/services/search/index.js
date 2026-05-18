var db = require('../../persistence'),
    config = require('../../config'),
    errors = require('generic-errors');

function searchSites(gfcToken, data, callback){
    db.Search.searchSites(config.gfcToken, data, callback);
}

module.exports = {
    searchSites: searchSites
};