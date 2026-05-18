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

function get(gfcToken, user, callback){
    var where = {};
    where['type'] = {$regex : "^control$"};
    where['userAccessLevel'] = {$lte : user.userAccessLevel };

    gfc.records.getAll(
        gfcToken,
        {
            skip: 0,
            limit: 999,
            query: {
                where: where 
            }
        },
        function(error, controls){
            if(error){
                return callback(error);
            }

            callback(null, controls.map(function(control){
                control.data._id = control.id;
                    return control.data;
                })
                .reduce(function(o, c, i){
                    o[c._id] = c;
                    return o;
                },{})
            );
        }
    );
}

module.exports = {
    get: get,
    create: create,
    update: update
};