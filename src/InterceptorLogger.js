'use strict';

var logger = require('./Logger')
    , configuration = require('./Configuration');

/**
 * Responsável por exibir os logs referentes as interceptações feitas.
 *
 * @constructor
 */
function InterceptorLogger() {
}

InterceptorLogger.prototype.log = function () {
    logger.log.apply(logger.log, arguments);
};

InterceptorLogger.prototype.success = function () {
    if (configuration.colors()) {
        logger.success.apply(logger.success, arguments);
    } else {
        logger.log.apply(logger.log, arguments);
    }
};

InterceptorLogger.prototype.info = function () {
    if (configuration.colors()) {
        logger.info.apply(logger.info, arguments);
    } else {
        logger.log.apply(logger.log, arguments);
    }
};

InterceptorLogger.prototype.error = function () {
    if (configuration.colors()) {
        logger.error.apply(logger.error, arguments);
    } else {
        logger.log.apply(logger.log, arguments);
    }
};

module.exports = new InterceptorLogger();