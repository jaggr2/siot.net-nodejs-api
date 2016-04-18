'use strict';

var util = require('util'),
    SiotDevice = require('./siot_device');

/**
 * [SiotActor]
 * This class represents an siot.net actor
 *
 * @class
 * @param {object} config the gateway config
 */
function SiotActor(config) {

    config.type = "actor";
    SiotDevice.call(this, config);
}

// Inherit functions from `EventEmitter`'s prototype
util.inherits(SiotActor, SiotDevice);



module.exports = SiotActor;