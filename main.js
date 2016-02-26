'use strict';

var configuration = require('./src/Configuration')
    , express = require('express')
    , Interceptor = require('./src/Interceptor')
    , logger = require('./src/Logger')
    , app = express()
    , interceptor = new Interceptor(app, express, configuration);

interceptor.intercept();

app.listen(configuration.port());

logger.log('\n', '-----------------------------------------------');
logger.log('Server started listen:', configuration.port());
logger.log('Api Host:', configuration.host());
logger.log('Root folder:', configuration.rootFolder());