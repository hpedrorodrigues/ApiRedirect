'use strict';

var properties = require('./properties.json');
var express = require('express');
var request = require('request');
var app = express();

var _properties = properties[properties.default];

var apiHost = process.argv[2] || _properties.api.host;

app.use(express.static('files'));

_properties.bind.forEach(function (bindObject) {

    if (bindObject && bindObject.uri && bindObject.path) {
        app.use(bindObject.uri, express.static(_properties.root_folder + bindObject.path));
    } else {
        console.log('Invalid value to bind object: ', bindObject);
    }
});

app.use('/', function (req, response) {
    var _request = request(apiHost + req.url);
    req
        .pipe(_request)
        .pipe(response);
});

app.listen(_properties.api.port);

console.info('Server started listen: ', _properties.api.port);
console.info('Api Host: ', apiHost);
console.info('Root folder: ', _properties.root_folder);