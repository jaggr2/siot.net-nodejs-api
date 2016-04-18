'use strict';

// # siot connector
//

var siot = module.exports = {};

// Linear Regression
siot.gateway = require('./src/siot_gateway');
siot.sensor = require('./src/siot_sensor');
siot.actor = require('./src/siot_actor');
