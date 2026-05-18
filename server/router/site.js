var requestData = require('request-data'),
    siteService = require('../services').site;

function update(request, response, tokens, data){
    var record = {};
    record.data = data.data;
    record.schemaId = data.schemaId;
    
    siteService.update(request.headers.authorization, tokens.siteId, record, function(error, site){
        console.log(error);
        if(error){
            response.writeHead(500);
            response.end(JSON.stringify(error.message));
            return;
        }

        response.end(JSON.stringify(site));
    });
}

function create(request, response, tokens, data){
    siteService.create(request.headers.authorization, data, function(error, site){

        if(error){
            response.writeHead(500);
            response.end(JSON.stringify(error.message));
            return;
        }

        response.end(JSON.stringify(site));
    });
}

function getAllSites(request, response){
    siteService.getAllSites(request.headers.authorization, function(error, sites){
        console.log('getAllSites, request origin: ',request.headers.origin)
        console.log('getAllSites, error: ',error)
    
        if(error){
            response.writeHead(500);
            response.end(JSON.stringify(error.message));
            return;
        }

        response.end(JSON.stringify(sites));
    });
}

function get(request, response, tokens){
    siteService.get(request.headers.authorization,tokens.siteId, function(error, site){

        if(error){
            response.writeHead(404);
            response.end(JSON.stringify(error.message));
            return;
        }

        response.end(JSON.stringify(site));
    });
}

module.exports = {
    '/sites': {
        POST: requestData(create),
        GET: getAllSites
    },
    '/sites/`siteId`': {
        GET: get,
        PUT: requestData(update)
    }
};