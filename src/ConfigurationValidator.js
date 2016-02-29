'use strict';

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

module.exports = new ConfigurationValidator();