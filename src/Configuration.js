'use strict';

var configuration = require('../configuration/configuration.json')
    , cli = require('./CLI')
    , Constants = require('./Constants')
    , configurationValidator = require('./ConfigurationValidator');

/**
 * Responsável por informar os dados já validados por {@link ConfigurationValidator}.
 *
 * @constructor
 */
function Configuration() {

    this.configuration = configuration[cli.api] || configuration[configuration.default] || configuration;

    if (!this.configuration.host) {
        var api = cli.api || configuration.default;
        configuration = require('../configuration/configuration.' + api + '.json');
        this.configuration = configuration[cli.api] || configuration[configuration.default] || configuration;
    }
}

/**
 * Informa o host para onde serão redirecionadas as requests.
 *
 * @returns {string}
 */
Configuration.prototype.host = function () {
    return cli.host || this.configuration.host;
};

/**
 * Informa a porta em que o servidor irá escutar.
 *
 * @returns {number}
 */
Configuration.prototype.port = function () {
    return cli.port || this.configuration.port || Constants.DEFAULT_CONFIGURATIONS.PORT;
};

/**
 * Informa os headers que serão adicionados a todas requests.
 *
 * @returns {object}
 */
Configuration.prototype.headers = function () {
    var request = this.configuration.request || {};
    return request.headers || Constants.DEFAULT_CONFIGURATIONS.HEADERS;
};

/**
 * Informa o timeout de todas as requests.
 *
 * @returns {number}
 */
Configuration.prototype.timeout = function () {
    var request = this.configuration.request || {};
    return request.timeout || Constants.DEFAULT_CONFIGURATIONS.TIMEOUT;
};

/**
 * Informa a pasta raiz do projeto.
 *
 * @returns {string}
 */
Configuration.prototype.rootFolder = function () {
    return this.configuration.root_folder || Constants.DEFAULT_CONFIGURATIONS.ROOT_FOLDER;
};

/**
 * Informa os objetos referentes as sobrescritas das respostas.
 *
 * @returns {object}
 */
Configuration.prototype.overrideResponses = function () {
    var overrideResponses = this.configuration.override_responses || Constants.DEFAULT_CONFIGURATIONS.OVERRIDE_RESPONSES;

    for (var property in overrideResponses) {
        var overrides = overrideResponses[property];

        overrides.forEach(function (override) {
            if (!configurationValidator.isValidOverrideResponse(override)) {

                throw new ReferenceError("Invalid value for a override response object: " + override);
            }
        });
    }

    return overrideResponses;
};

/**
 * Informa os objetos a serem bindados, uri + path ou apenas folder.
 *
 * @returns {Array}
 */
Configuration.prototype.bindObjects = function () {
    return this.configuration.bind.map(function (bind) {
        if (configurationValidator.isValidBindObject(bind)) {
            return bind;
        } else {
            throw new ReferenceError("Invalid value for a bind object: " + bind);
        }
    });
};

/**
 * Informa se a aplicação deve exibir as respostas de todas as requests.
 *
 * @returns {boolean}
 */
Configuration.prototype.showResponse = function () {
    var log = this.configuration.log || {};
    return !!(log.show_response || Constants.DEFAULT_CONFIGURATIONS.SHOW_RESPONSE);
};

/**
 * Informa se a aplicação deve exibir informações das requests, por exemplo: tempo, código de status...
 *
 * @returns {boolean}
 */
Configuration.prototype.showRequestInfo = function () {
    var log = this.configuration.log || {};
    return !!(log.show_request_info || Constants.DEFAULT_CONFIGURATIONS.SHOW_REQUEST_INFO);
};

/**
 * Informa se a aplicação deve exibir erros referentes as requests.
 *
 * @returns {boolean}
 */
Configuration.prototype.showRequestError = function () {
    var log = this.configuration.log || {};
    return !!(log.show_request_error || Constants.DEFAULT_CONFIGURATIONS.SHOW_REQUEST_ERROR);
};

/**
 * Habilita cores na saída da aplicação: stdout.
 *
 * @returns {boolean}
 */
Configuration.prototype.colors = function () {
    var log = this.configuration.log || {};
    return !!(log.colors || Constants.DEFAULT_CONFIGURATIONS.COLORS);
};

module.exports = new Configuration();