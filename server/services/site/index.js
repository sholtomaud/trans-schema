var sitePersistence = require('../../persistence').Site;

function get(gfcToken, siteId, callback){
    if(siteId === ''){
        return callback(new Error('Not found'));
    }
    sitePersistence.get(gfcToken, siteId, callback);
}

function getAllSites(gfcToken, callback){
    sitePersistence.getAllSites(gfcToken, callback);
}

function create(gfcToken, data, callback){
    sitePersistence.create(gfcToken, data, callback);
}

function update(gfcToken, siteId, data, callback){
    if(siteId === ''){
        return callback(new Error('Not found'));
    }
    sitePersistence.update(gfcToken, siteId, data, callback);
}

module.exports = {
    get: get,
    getAllSites: getAllSites,
    create: create,
    update: update
};