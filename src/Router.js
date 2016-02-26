'use strict';

var request = require('request')
    , logger = require('./Logger');

/**
 * Responsável por todos os tratamentos referentes as rotas.
 *
 * @constructor
 */
function Router(app, express, configuration) {

    var self = this,
        _headers = configuration.headers(),
        _baseRequest = _headers ? request.defaults({headers: _headers, jar: true}) : request;

    var _logInfo = function () {
        if (configuration.colors()) {
            logger.info.apply(logger.info, arguments);
        } else {
            logger.log.apply(logger.info, arguments);
        }
    };

    var _logError = function () {
        if (configuration.colors()) {
            logger.error.apply(logger.error, arguments);
        } else {
            logger.log.apply(logger.info, arguments);
        }
    };

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

            if (configuration.printRequestUrl()) {
                _logInfo('\n', '------------------------------------');
                _logInfo('\n', url);
            }

            var _request = _baseRequest(url, {timeout: configuration.timeout()}, function (error, response, body) {
                if (configuration.printRequestError() && error) {
                    _logError(error);
                }

                if (configuration.printResponse() && body) {
                    _logInfo(body);
                }
            });

            req
                .pipe(_request)
                .pipe(response);
        });
    };

    self.router = function () {
        _bindObjects();
        _bindOverrideResponses();
        _makeRequests();
    };
}

module.exports = Router;