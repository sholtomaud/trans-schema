var gfc = require('gfc-node')();

function create(gfcToken, recordData, callback){
    gfc.records.create(
        gfcToken,
        recordData,
        function(error, site){
            if(error){
                return callback(error);
            }
            site.data._id = site.id;
            callback(null, site);
        }
    );
}

function update(gfcToken, siteId, recordData, callback){
    gfc.records.update(
        gfcToken,
        siteId,
        recordData,
        function(error, site){
            if(error){
                return callback(error);
            }
            site.data._id = site.id;
            callback(null, site);
        }
    );
}
    
function get(gfcToken, siteId, callback){
    gfc.records.get(
        gfcToken,
        siteId,
        function(error, site){
            if(error){
                return callback(error);
            }
            site.data._id = site.id;
            callback(null, site);
        }
    );
}

function getAllSites(gfcToken, callback){
    gfc.records.getAll(
        gfcToken,
        {
            skip: 0,
            limit: 5,
            query: {
                where: {
                    type: 'site'
                }
            }
        },
        function(error, documents){
            if(error){
                return callback(error);
            }

            var records = documents.reverse();

            callback(null, records.map(function(site){
                site.data._id = site.id;
                return site.data;
            }));
        }
    );
}

module.exports = {
    get: get,
    getAllSites: getAllSites,
    create: create,
    update: update
};