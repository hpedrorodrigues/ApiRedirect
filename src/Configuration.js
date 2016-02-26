'use strict';

var properties = require('../configuration/configuration.json')
    , commandLineArgs = require('command-line-args');

/**
 * Cli Options
 */
var cli = commandLineArgs([
  { name: 'api', alias: 'a', type: String },
  { name: 'host', alias: 'h', type: String },
  { name: 'port', alias: 'p', type: Number }
]).parse();

/**
 * Objeto que contém as informações padrão das propriedades.
 *
 * @type {object}
 */
var DEFAULT = {
    PORT: 3000,
    TIMEOUT: 30000,
    ROOT_FOLDER: __dirname,
    OVERRIDE_RESPONSES: {},
    BIND_OBJECTS: [],
    HEADERS: {},
    PRINT_RESPONSE: false,
    PRINT_REQUEST_URL: true,
    PRINT_REQUEST_ERROR: true,
    COLORS: false
};

/**
 * Responsável por validar se as configurações fornecidas no arquivo {@link properties.json} são validas.
 *
 * @constructor
 */
function ConfigurationValidator() {
}

/**
 * Verifica se o objeto de sobrescrita de respostas é válido.
 *
 * @param override
 * @returns {boolean}
 */
ConfigurationValidator.prototype.isValidOverrideResponse = function (override) {
    return !!(override && override.field && override.value);
};

/**
 * Verifica se o objeto a ser feito o bind dos paths dos arquivos estáticos é válido.
 *
 * @param bind
 * @returns {boolean}
 */
ConfigurationValidator.prototype.isValidBindObject = function (bind) {
    return !!(bind && ((bind.uri && bind.path) || bind.folder));
};

/**
 * Responsável por informar os dados já validados por {@link ConfigurationValidator}.
 *
 * @constructor
 */
function Configuration() {

    var self = this,
        _properties = properties[cli.api] || properties[properties.default] || properties,
        _validator = new ConfigurationValidator();

    if(!_properties.host){
        var api = cli.api || properties.default;
        _properties = require('../configuration/configuration.' + api + '.json');
    }

    self.host = function () {
        return cli.host || _properties.host;
    };

    self.port = function () {
        return cli.port || _properties.port || DEFAULT.PORT;
    };

    self.headers = function () {
        var request = _properties.request || {};
        return request.headers || DEFAULT.HEADERS;
    };

    self.timeout = function () {
        var request = _properties.request || {};
        return request.timeout || DEFAULT.TIMEOUT;
    };

    self.rootFolder = function () {
        return _properties.root_folder || DEFAULT.ROOT_FOLDER;
    };

    self.overrideResponses = function () {
        var overrideResponses = _properties.override_responses || DEFAULT.OVERRIDE_RESPONSES;

        for (var property in overrideResponses) {
            var overrides = overrideResponses[property];

            overrides.forEach(function (override) {
                if (!_validator.isValidOverrideResponse(override)) {

                    throw new ReferenceError("Invalid value for a override response object: " + override);
                }
            });
        }

        return overrideResponses;
    };

    self.bindObjects = function () {
        return _properties.bind.map(function (bind) {
            if (_validator.isValidBindObject(bind)) {
                return bind;
            } else {
                throw new ReferenceError("Invalid value for a bind object: " + bind);
            }
        });
    };

    self.printResponse = function () {
        var log = _properties.log || {};
        return !!(log.print_response || DEFAULT.PRINT_RESPONSE);
    };

    self.printRequestUrl = function () {
        var log = _properties.log || {};
        return !!(log.print_request_url || DEFAULT.PRINT_REQUEST_URL);
    };

    self.printRequestError = function () {
        var log = _properties.log || {};
        return !!(log.print_request_error || DEFAULT.PRINT_REQUEST_ERROR);
    };

    self.colors = function () {
        var log = _properties.log || {};
        return !!(log.colors || DEFAULT.COLORS);
    };
}

module.exports = new Configuration();
