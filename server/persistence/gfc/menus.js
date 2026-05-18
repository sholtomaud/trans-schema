var gfc = require('gfc-node')();

function create(gfcToken, recordData, callback){
    gfc.records.create(
        gfcToken,
        recordData,
        function(error, menu){
            if(error){
                return callback(error);
            }
            menu.data._id = menu.id;
            callback(null, menu);
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

function get(gfcToken, user, applicationId, callback){
    
    var where = {};
    // where['companyId'] = {$regex : "^" + user.companyId + "$"};
    where['type'] = {$regex : "^menu$"};
    where['applicationId'] = {$regex : "^" + applicationId + "$"};
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
        function(error, menus){
            if(error){
                return callback(error);
            }
            
            callback(null, menus.map(function(menu){
                    menu.data._id = menu.id;
                    menu['data']['visibility'] = 'hidden';
                    return menu.data;
                })
                .reduce(function(o, m, i){
                    o[m._id] = m;
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