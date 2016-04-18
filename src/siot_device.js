'use strict';

var uuid = require("node-uuid"),
    util = require('util'),
    EventEmitter = require('events'),
    async = require('async');

/**
 * [SiotDevice]
 * base class for the siot.net devices
 *
 * @class
 * @param {object} config the gateway config
 */
function SiotDevice(config) {

    this.config = {};

    this.listenToSensorUUID = null;
    this.gatewayReference = null;

    this.uuid = config.uuid || uuid.v4().toString();

    this.manifest = {
        name: config.name || "NodeJS Sensor",
        type: config.type,
        description: config.description,
        valueType: config.valueType
    };

    EventEmitter.call(this);
}

// Inherit functions from `EventEmitter`'s prototype
util.inherits(SiotDevice, EventEmitter);

/**
 *  sends the device manifest to the center and subscribe its config topic
 *
 * @param {object} gatewayReference the gateway
 * @param {function} callback the result
 */
SiotDevice.prototype.register = function (gatewayReference, callback) {
    var self = this;

    self.gatewayReference = gatewayReference;

    async.series([
            function (done) {
                self.gatewayReference.subscribe(self.uuid, "CNF", done);
            },
            function (done) {
                self.gatewayReference.publish(self.uuid, "MNF", JSON.stringify(self.manifest), done);
            }
        ], callback);
};

/**
 *  unregisters this siot device and unsubscribe its topics
 *
 * @param {function} callback the result
 */
SiotDevice.prototype.unregister = function (callback) {
    var self = this;

    if(!self.gatewayReference) return callback();

    async.series([
        function (done) {
            if(self.listenToSensorUUID) {
                self.emit('_unregister_sensor', self.listenToSensorUUID);
            }
            else {
                async.setImmediate(done);
            }
        },
        function (done) {
            self.gatewayReference.unsubscribe(self.uuid, "CNF", done);
        },
        function (done) {
            // siot.net does not specifiy any disconnected message, so this is commented out until this will be changed
            // self.gatewayReference.publish(self.uuid, "MNF", JSON.stringify(self.manifest), done);
            async.setImmediate(done);
        }
    ], function(err) {
        if(err) return callback(err);

        self.gatewayReference = null;
    });
};

/**
 *  parses the retrieved mqtt message and emit to corresponding events
 *
 * @param {string} type the siot message type
 * @param {string} topic the mqtt topic
 * @param {string} message the message
 */
SiotDevice.prototype.handleMessage = function (type, topic, message) {
    var self = this;

    switch(type) {
        case "CNF":

            var newConfig = null;
            try {
                newConfig = JSON.parse(message.toString());
            }
            catch(e) {
                // debug
            }

            if(newConfig.sensor) {
                if(this.listenToSensorUUID) self.emit('_unregister_sensor', this.listenToSensorUUID);

                this.listenToSensorUUID = newConfig.sensor;

                self.emit('_register_sensor', newConfig.sensor);
            }

            this.emit('siot_config', newConfig);
            break;

        case "DAT":
            this.emit('siot_data', message.toString());
            break;

    }
};

module.exports = SiotDevice;