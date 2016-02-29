'use strict';

var commandLineArgs = require('command-line-args');

var cli = commandLineArgs([

    {
        name: 'api',
        alias: 'a',
        type: String
    }, {
        name: 'host',
        alias: 'h',
        type: String
    }, {
        name: 'port',
        alias: 'p',
        type: Number
    }

]).parse();

module.exports = cli;