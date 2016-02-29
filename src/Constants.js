'use strict';

/**
 * Objeto que contém todas as constantes utilizadas na aplicação.
 *
 * @constructor
 */
function Constants() {
}

/**
 * Tipos de sobrescrita de respostas:
 *
 * FULL: sobrescreve toda a resposta, removendo os valores existentes e adicionando os valores informados no arquivo de
 * configuração.
 * JOIN: concatena os valores existentes com os informados no arquivo de configuração, caso se repitam, o que ficará
 * será o valor informado no arquivo de configuração.
 *
 * @type {object}
 */
Constants.prototype.OVERRIDE_RESPONSE_TYPES = {
    FULL: "$full",
    JOIN: "$join"
};

/**
 * Tipos de objetos permitidos:
 *
 * FILE: caso essa propriedade seja informada, a aplicação tentará ler um arquivo json para substituição da resposta.
 * JSON: caso essa propriedade seja informada, a aplicação entenderá que o valor informado já será o json para substiuição.
 *
 * @type {object}
 */
Constants.prototype.OVERRIDE_RESPONSE_TYPE_OBJECTS = {
    FILE: "$file",
    JSON: "$json"
};

/**
 * Objeto que contém as configurações padrões da aplicação.
 * Utilizado caso alguma propriedade não seja informada no arquivo de configuração.
 *
 * @type {object}
 */
Constants.prototype.DEFAULT_CONFIGURATIONS = {
    PORT: 3000,
    TIMEOUT: 30000,
    ROOT_FOLDER: __dirname,
    OVERRIDE_RESPONSES: {},
    BIND_OBJECTS: [],
    HEADERS: {},
    SHOW_RESPONSE: false,
    SHOW_REQUEST_INFO: false,
    SHOW_REQUEST_ERROR: false,
    COLORS: false
};

module.exports = new Constants();