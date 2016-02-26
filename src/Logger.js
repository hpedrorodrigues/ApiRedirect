'use strict';

var colors = require('colors')
    , util = require('util');

function Logger() {
    var self = this;

    var _formatMessage = function (object) {
        var message = '';

        for (var index in object) {

            var value = object[index];

            message += (message ? ' ' : '') + ((typeof value === 'string') ? value : util.inspect(value));
        }

        return message;
    };

    self.error = function () {
        console.log(colors.red(_formatMessage(arguments)));
    };

    self.info = function () {
        console.log(colors.blue(_formatMessage(arguments)));
    };

    self.warn = function () {
        console.log(colors.yellow(_formatMessage(arguments)));
    };

    self.log = function () {
        console.log(_formatMessage(arguments));
    };
}

module.exports = new Logger();