'use strict';

var configuration = require('./src/Configuration')
    , express = require('express')
    , Router = require('./src/Router')
    , logger = require('./src/Logger')
    , app = express();

new Router(app, express, configuration).router();

app.listen(configuration.port());

logger.log('\n', '-----------------------------------------------');
logger.log('Server started listen:', configuration.port());
logger.log('Api Host:', configuration.host());
logger.log('Root folder:', configuration.rootFolder());
