'use strict';

var properties = require('./properties.json');
var express = require('express');
var request = require('request');
var app = express();

var host = process.argv[2] || properties.host;

app.use(express.static('files'));

properties.bind.forEach(function (mapObject) {

    if (mapObject && mapObject.uri && mapObject.path) {
        app.use(mapObject.uri, express.static(properties.root_folder + mapObject.path));
    } else {
        console.log('Invalid value to map object: ', mapObject);
    }
});

app.use('/', function (req, response) {
    req
        .pipe(request(host + req.url))
        .pipe(response);
});

app.listen(3000);

console.log('Server started listen 3000');
console.log('Api Host: ', host);
console.log('Root folder: ', properties.root_folder);