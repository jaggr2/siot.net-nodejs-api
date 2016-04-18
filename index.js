'use strict';

var siot = module.exports = {};

siot.gateway = require('./src/siot_gateway');
siot.sensor = require('./src/siot_sensor');
siot.actor = require('./src/siot_actor');
