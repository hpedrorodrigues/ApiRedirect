'use strict';

var properties = require('./properties.json')
    , express = require('express')
    , request = require('request')
    , app = express()
    , _properties = properties[properties.default] || properties
    , host = process.argv[2] || _properties.host
    , port = _properties.port
    , headers = _properties.headers
    , overrideResponses = _properties.override_responses
    , timeout = _properties.timeout || 30000
    , rootFolder = _properties.root_folder
    , baseRequest = headers ? request.defaults({headers: headers, jar: true}) : request;

_properties.bind.forEach(function (bindObject) {

    if (bindObject && bindObject.uri && bindObject.path) {

        app.use(bindObject.uri, express.static(rootFolder + bindObject.path));
    } else {

        console.warn('Invalid value to bind object: ', bindObject);
    }
});

if (overrideResponses && overrideResponses.length) {

    overrideResponses.forEach(function (overrideResponse) {

        if (overrideResponse && overrideResponse.uri && overrideResponse.field && overrideResponse.value) {

            app.use(overrideResponse.uri, function (req, res) {

                var url = host + overrideResponse.uri
                    , field = overrideResponse.field
                    , value = overrideResponse.value;

                var _request = baseRequest(url, function (err, response, body) {

                    body = JSON.parse(body);

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
                });

                req.pipe(_request);
            });
        } else {

            console.warn('Invalid value to override object: ', overrideResponse);
        }
    });
}

app.use('/', function (req, response) {

    var url = host + req.url;

    console.info('\n', url);

    var _request = baseRequest(url, {timeout: timeout}, function (err) {
        if (err) {
            console.error(err);
        }
    });

    req
        .pipe(_request)
        .pipe(response);
});

app.listen(port);

console.info('\n', '-----------------------------------------------');
console.info('Server started listen:', port);
console.info('Api Host:', host);
console.info('Root folder:', rootFolder);