'use strict';

var properties = require('./properties.json')
    , express = require('express')
    , request = require('request')
    , app = express()
    , _properties = properties[properties.default] || properties
    , host = process.argv[2] || _properties.host
    , port = _properties.port
    , headers = _properties.headers
    , overrideResponses = _properties.override_responses;

app.use(express.static('files'));

_properties.bind.forEach(function (bindObject) {

    if (bindObject && bindObject.uri && bindObject.path) {

        app.use(bindObject.uri, express.static(_properties.root_folder + bindObject.path));
    } else {

        console.log('Invalid value to bind object: ', bindObject);
    }
});

if (overrideResponses && overrideResponses.length) {

    overrideResponses.forEach(function (overrideResponse) {

        if (overrideResponse && overrideResponse.uri && overrideResponse.field && overrideResponse.value) {

            app.use(overrideResponse.uri, function (req, res) {

                var url = host + overrideResponse.uri;

                req.pipe(request(url, function (err, response, body) {

                    body = JSON.parse(body);

                    var field = overrideResponse.field;
                    var value = overrideResponse.value;

                    if (field.indexOf('.') > -1) {

                        var splittedField = field.split('.');
                        var lastField = splittedField[splittedField.length - 1];

                        splittedField.reduce(function (object, property) {
                            if (object && property) {

                                if (property == lastField) {
                                    object[property] = value;
                                }

                                return object[property];
                            }
                        }, body);
                    } else {

                        body[field] = value;
                    }

                    res.json(body);

                    return body;
                }));
            });
        } else {

            console.log('Invalid value to override object: ', overrideResponse);
        }
    });
}

app.use('/', function (req, response) {

    if (headers) {
        for (var headerName in headers) {
            req.headers[headerName] = headers[headerName];
        }
    }

    req
        .pipe(request(host + req.url))
        .pipe(response);
});

app.listen(port);

console.info('\n', '-----------------------------------------------');
console.info('Server started listen:', port);
console.info('Api Host:', host);
console.info('Root folder:', _properties.root_folder);