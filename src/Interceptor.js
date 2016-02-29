'use strict';

var request = require('request')
    , interceptorLogger = require('./InterceptorLogger');

/**
 * Responsável por todos os tratamentos referentes as rotas.
 *
 * @constructor
 */
function Interceptor(app, express, configuration) {

    var self = this
        , _headers = configuration.headers()
        , _baseRequest = _headers ? request.defaults({headers: _headers, jar: true}) : request;

    var _bindObjects = function () {
        configuration.bindObjects().forEach(function (bind) {
            if (bind.folder) {
                app.use(express.static(bind.folder));
            } else {
                app.use(bind.uri, express.static(configuration.rootFolder() + bind.path));
            }
        });
    };

    var _bindOverrideResponses = function () {
        var overrideResponses = configuration.overrideResponses();

        for (var uri in overrideResponses) {
            var overrides = overrideResponses[uri];

            overrides.forEach(function (override) {

                app.use(uri, function (req, res) {

                    var url = configuration.host() + uri
                        , field = override.field
                        , value = override.value;

                    var _request = _baseRequest(url, function (err, response, body) {

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
            });
        }
    };

    var _makeRequests = function () {

        app.use('/', function (req, response) {

            var url = configuration.host() + req.url;
            var requestStartTime = new Date();

            var _request = _baseRequest(url, {timeout: configuration.timeout()}, function (error, response, body) {
                var jsonBody = {}
                    , hasError = false;

                try {
                    jsonBody = JSON.parse(body);
                } catch (e) {
                    hasError = !!(body);
                    jsonBody = JSON.parse(JSON.stringify(body ? {'error': body} : ['Empty body']));
                }

                if (configuration.showRequestInfo()) {
                    interceptorLogger.info('\n-----------------------------------------------');

                    var statusCode = response.statusCode
                        , requestEndTime = (new Date() - requestStartTime) + 'ms'
                        , header = '(' + response.statusCode + ') ' + requestEndTime;


                    if (statusCode < 400) {
                        interceptorLogger.success(header);
                    } else {
                        hasError = true;
                        interceptorLogger.error(header);
                    }

                    interceptorLogger.info("URL: " + decodeURI(url));
                }

                if (configuration.showRequestError() && error) {
                    interceptorLogger.error(error);
                }

                if (configuration.showResponse() && jsonBody) {
                    interceptorLogger.log('Response');

                    var loggerFunction = hasError ? interceptorLogger.error : interceptorLogger.info;
                    loggerFunction.call(loggerFunction, JSON.stringify(jsonBody, null, 4));
                }
            });

            req
                .pipe(_request)
                .pipe(response);
        });
    };

    self.intercept = function () {
        _bindObjects();
        _bindOverrideResponses();
        _makeRequests();
    };
}

module.exports = Interceptor;
