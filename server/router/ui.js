var logger = require('../logger'),
    retorter = require('./retorter')(logger),
    actions = require('../actions'),
    requestData = require('request-data'),
    wraperr = require('wraperr'),
    FileServer = require('file-server'),
    fileServer = new FileServer(function(error, request, response){
        retorter.error(request, response, error);
    }),
    path = require('path'),
    publicPath = path.join(__dirname, '../../public'),
    controlsService = require('../services').controls;
    menusService = require('../services').menus;

function controls(request, response, tokens, data){
    controlsService.getControls( data, function(error, controls){
        if(error){
            response.writeHead(500);
            response.end(JSON.stringify(error.message));
            return;
        }

        response.end(JSON.stringify(controls));
    })
}

function menus(request, response, tokens, data){
    menusService.getMenus( data, function(error, menus){
        if(error){
            response.writeHead(500);
            response.end(JSON.stringify(error.message));
            return;
        }

        response.end(JSON.stringify(menus));
    })
}

module.exports = {
    '/controls': {
        POST: requestData(controls)
    },
    '/menus': {
        POST: requestData(menus)
    }
};