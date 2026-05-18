var gfc = require('gfc-node')();

function searchSites(gfcToken, data, callback){
    var where = { };
    where['rn'] = {$regex : "^" + data.value};
    
    gfc.records.getAll(
        gfcToken,
        {
            skip: 0,
            limit: 10,
            query: {
                where: where
            }
        },
        function(error, sites){
            if(error){
                return callback(error);
            }
            
            callback(null, sites.map( function(site){
                site.data._id = site.id;
                return site.data;
            }));
            
        }
    );
}

module.exports = {
    searchSites: searchSites
};