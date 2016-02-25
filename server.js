'use strict';

var properties = require('./properties.json');
var express = require('express');
var request = require('request');
var app = express();

var apiHost = process.argv[2] || properties.api.host;

app.use(express.static('files'));

properties.map.forEach(function (mapObject) {

    if (mapObject && mapObject.path && mapObject.uri) {
        app.use(mapObject.path, express.static(properties.root_folder + mapObject.uri));
    } else {
        console.log('Invalid value to map object: ', mapObject);
    }
});

app.use('/', function (req, response) {
    req
        .pipe(request(apiHost + req.url))
        .pipe(response);
});

app.listen(3000);

console.log('Server started listen 3000');
console.log('Api Host: ', apiHost);
console.log('Root folder: ', properties.root_folder);