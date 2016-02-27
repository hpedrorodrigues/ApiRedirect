'use strict';

var request = require('request')
    , logger = require('./Logger');

/**
 * Responsável por exibir os logs referentes as interceptações feitas.
 *
 * @param configuration
 * @constructor
 */
function InterceptorLogger(configuration) {

    var self = this;

    self.log = function () {
        logger.log.apply(logger.log, arguments);
    };

    self.success = function () {
        if (configuration.colors()) {
            logger.success.apply(logger.success, arguments);
        } else {
            logger.log.apply(logger.log, arguments);
        }
    };

    self.info = function () {
        if (configuration.colors()) {
            logger.info.apply(logger.info, arguments);
        } else {
            logger.log.apply(logger.log, arguments);
        }
    };

    self.error = function () {
        if (configuration.colors()) {
            logger.error.apply(logger.error, arguments);
        } else {
            logger.log.apply(logger.log, arguments);
        }
    };
}

/**
 * Responsável por todos os tratamentos referentes as rotas.
 *
 * @constructor
 */
function Interceptor(app, express, configuration) {

    var self = this
        , _interceptorLogger = new InterceptorLogger(configuration)
        , _headers = configuration.headers()
        , _baseRequest = _headers ? request.defaults({headers: _headers, jar: true}) : request;

    var _bindObjects = function () {
        configuration.bindObjects().forEach(function (bind) {
            app.use(bind.uri, express.static(configuration.rootFolder() + bind.path));
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
                    hasError = true;
                    jsonBody = JSON.parse(JSON.stringify({'error': body}));
                }

                if (configuration.printRequestInfo()) {
                    _interceptorLogger.info('\n-----------------------------------------------');

                    var statusCode = response.statusCode
                        , requestEndTime = (new Date() - requestStartTime) + 'ms'
                        , header = '(' + response.statusCode + ') ' + requestEndTime;


                    if (statusCode < 400) {
                        _interceptorLogger.success(header);
                    } else {
                        hasError = true;
                        _interceptorLogger.error(header);
                    }

                    _interceptorLogger.info("URL: " + decodeURI(url));
                }

                if (configuration.printRequestError() && error) {
                    _interceptorLogger.error(error);
                }

                if (configuration.printResponse() && jsonBody) {
                    _interceptorLogger.log('Response');

                    var loggerFunction = hasError ? _interceptorLogger.error : _interceptorLogger.info;
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
