'use strict';

var util = require('util'),
    SiotDevice = require('./siot_device');

/**
 * [SiotSensor]
 * This class represents a siot
 *
 * @class
 * @param {object} config the gateway config
 */
function SiotSensor(config) {

    config.type = "sensor";
    SiotDevice.call(this, config);
}

// Inherit functions from `EventEmitter`'s prototype
util.inherits(SiotSensor, SiotDevice);

/**
 *  send data formmatted as serialised json. JSON structure: { time: CURRENTTIME, value: DATA}
 *
 *
 * @param {string} data the data to be send as string
 * @param {function} callback the result
 */
SiotSensor.prototype.sendSensorData = function (data, callback) {
    var self = this;

    if(!self.gatewayReference) return callback(new Error('Device not registered'));

    var output = {
        time: (new Date()).toString(),
        value: data
    };

    self.gatewayReference.publish(self.uuid, "DAT", JSON.stringify(output), callback);
};

/**
 *  send data raw and only formatted as string
 *
 * @param {string} data the data to be send as string
 * @param {function} callback the result
 */
SiotSensor.prototype.sendRawData = function (data, callback) {
    var self = this;

    if(!self.gatewayReference) return callback(new Error('Device not registered'));

    self.gatewayReference.publish(self.uuid, "DAT", data.toString(), callback);
};

module.exports = SiotSensor;