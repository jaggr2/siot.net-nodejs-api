'use strict';

var mqtt = require('mqtt'),
    http = require('http'),
    url = require('url'),
    util = require('util'),
    EventEmitter = require('events'),
    async = require('async');
/**
 * [SiotGateway]
 * this class represents the siot.net gateway
 *
 * @class
 * @param {object} config the gateway config
 */
function SiotGateway(config) {

    if(!config) config = {};

    this.config = {};

    this.config.sioturl = config.sioturl || "url.siot.net";
    this.config.centerLicense = config.centerLicense || null;
    this.config.mqttCenterURLs = config.mqttCenterURLs || [];
    this.config.mqttPrefix = config.mqttPrefix || "siot";


    this.isConnected = false;
    this.isConnecting = false;
    this.connectedURL = null;
    this.mqttClient = null;
    this.deviceList = [];

    EventEmitter.call(this);
}

// Inherit functions from `EventEmitter`'s prototype
util.inherits(SiotGateway, EventEmitter);

/**
 *  get the list of available licences of e specified client
 *
 *
 * @param {string} clientid the id of the client
 * @param {function} callback the result
 */
SiotGateway.prototype.getLicenseList = function (clientid, callback) {

    var options = {
        host: this.config.sioturl,
        path: '/licence/list?client=' + clientid
    };

    console.log("HTTP GET", options.host + options.path);

    return http.get(options, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {

            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
            callback(null, parsed);
        });
    });
};

/**
 *  get the url of the siot center and its mqtt broker
 *
 *
 * @param {string} licenseKey license key of the siot center
 * @param {function} callback the result
 */
SiotGateway.prototype.retrieveCenterURLs = function ( licenseKey, callback) {

    var options = {
        host: this.config.sioturl,
        path: '/?licence=' + licenseKey
    };

    console.log("HTTP GET", options.host + options.path);

    return http.get(options, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {

            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);

            if(parsed.error_code) {
                return console.error("siot center lookup returned error code", json);
            }

            //console.log('response ', parsed);

            callback(null, parsed);
        });
    });
};

/**
 *  get the manifest from a device
 *
 *
 * @param {string} sensorUUID license key of the siot center
 * @param {function} callback the result
 */
SiotGateway.prototype.retrieveManifest = function (sensorUUID, callback) {


    // NOTE: this should not be a call to a REST API. This should be done over MQTT according to the original SIOT specification!
    var options = {
        method: "POST",
        host: this.config.sioturl, //siotConfig.mqttCenterURLs[0],
        path: '/getmanifest?sensorUID=' + sensorUUID
    };

    console.log("HTTP", options.method, options.host + options.path);

    var req = http.request(options, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {

            /* Data reception is done, do whatever with it!
             var parsed = JSON.parse(body);

             if(parsed.error_code) {
             return console.error("siot center lookup returned error code", json);
             } */

            console.log('response ', body.toString());

            callback(null, null);
        });
    });
    req.end();
};


/**
 *  connects to the siot center
 *
 * @param {function} callback the result
 */
SiotGateway.prototype.connect = function (callback) {
    var self = this;

    if(self.isConnected || self.isConnecting) return callback();

    self.isConnecting = true;

    async.series([
        function(done){
            if(!self.config.mqttCenterURLs || self.config.mqttCenterURLs.length == 0) {
                self.retrieveCenterURLs(self.config.centerLicense, function(err, result) {
                    if(err) return done(err);

                    self.config.mqttCenterURLs = result.mqtt.urls || [];
                    done();
                });
            }
            else {
                async.setImmediate(done);
            }
        },
        function(done){

            var brokerURL = url.parse(self.config.mqttCenterURLs[0]);

            // correct malformed URL from siot
            if(!brokerURL.protocol) {
                brokerURL = {
                    protocol: "mqtt",
                    slashes: true,
                    host: self.config.mqttCenterURLs[0]
                };
            }

            self.connectedURL = url.format(brokerURL);

            console.log('connecting to: ', self.connectedURL);

            self.mqttClient = mqtt.connect(self.connectedURL, {
                reconnectPeriod: 5 * 1000
            });

            self.mqttClient.once('connect', function() {
                self.isConnected = true;
                self.isConnecting = false;

                console.log('changed state to connected');

                async.map(self.deviceList, function(device, callback) {
                    device.register(self, callback);
                }, done);
            });

            self.mqttClient.on('close', function() {
                self.isConnecting = false;
                self.isConnected = false;

                console.log('changed state to disconnected');

                self.emit('close');
            });

            self.mqttClient.on('reconnect', function() {
                self.isConnecting = true;
                console.log('changed state to reconnecting');
                self.emit('reconnect');
            });

            self.mqttClient.on('connect', function(packet) {
                self.emit('connect', packet);
            });

            self.mqttClient.on('error', function (error) {
                self.isConnecting = false;
                self.emit('error', error);
            });

            self.mqttClient.on('message', self.handleMessage.bind(self));
        }
    ], callback);
};

/**
 *  disconnects the siot center connection
 *
 * @param {boolean} force true = do not await acknowledge
 * @param {function} callback the result
 */
SiotGateway.prototype.disconnect = function (force, callback) {
    this.mqttClient.end(force, callback);
};


/**
 *  handles an incoming message
 *
 * @param {string} topic
 * @param {string} message
 */
SiotGateway.prototype.handleMessage = function (topic, message) {

    var self = this;
    var elements = topic.split("/");
    var deviceUUID = elements[3];
    var type = elements[1];

    for(var i = 0; i < self.deviceList.length; i++) {
        if(self.deviceList[i].uuid == deviceUUID || self.deviceList[i].listenToSensorUUID == deviceUUID ) {
            self.deviceList[i].handleMessage(type, topic, message);
        }
    }
};

/**
 *  registers a new sensor/actor and publish their manifest. If the gateway is not connected, then the manifest will be send once the gateway is connected.
 *
 * @param {object} device the Siot Device which should be registered
 * @param {function} callback the result
 */
SiotGateway.prototype.registerDevice = function (device, callback) {
    var self = this;

    device.on('_unregister_sensor', function(deviceUUID) {
        self.unsubscribe(deviceUUID, "DAT", function(err) {
            if(err) console.error(err);
        });
    });

    device.on('_register_sensor', function(deviceUUID) {
        self.subscribe(deviceUUID, "DAT", function(err) {
            if(err) console.error(err);
        });
    });

    self.deviceList.push(device);

    if(this.isConnected) {
        device.register(self, callback);
    }
    else {
        callback();
    }
};

/**
 *  registers a new sensor
 *
 * @param {object} device the Siot Device which should be registered
 * @param {function} callback the result
 */
SiotGateway.prototype.unregisterDevice = function (device, callback) {
    var self = this;

    var index = self.deviceList.indexOf(device);

    if (index > -1) {
        self.deviceList.splice(index, 1);
    }
    else {
        return callback(new Error('device not found'));
    }

    device.unregister(callback);
};

/**
 *  publishs the payload according to the siot topic structure
 *
 * @param {string} deviceUUID
 * @param {string} type
 * @param {string} payloadString
 * @param {function} callback the result
 */
SiotGateway.prototype.publish = function (deviceUUID, type, payloadString, callback) {
    console.log("PUBLISH ", this.config.mqttPrefix + '/' + type + '/' + this.config.centerLicense + '/' + deviceUUID + '', payloadString);
    this.mqttClient.publish(this.config.mqttPrefix + '/' + type + '/' + this.config.centerLicense + '/' + deviceUUID + '', payloadString, callback);
};

/**
 *  subscribe for messages according to the siot topic structure
 *
 * @param {string} deviceUUID
 * @param {string} type
 * @param {function} callback the result
 */
SiotGateway.prototype.subscribe = function (deviceUUID, type, callback) {
    console.log("SUBSCRIBE ", this.config.mqttPrefix + '/' + type + '/' + this.config.centerLicense + '/' + deviceUUID + '');
    this.mqttClient.subscribe(this.config.mqttPrefix + '/' + type + '/' + this.config.centerLicense + '/' + deviceUUID + '', callback);
};

/**
 *  unsubscribe
 *
 * @param {string} deviceUUID
 * @param {string} type
 * @param {function} callback the result
 */
SiotGateway.prototype.unsubscribe = function (deviceUUID, type, callback) {
    console.log("UNSUBSCRIBE ", this.config.mqttPrefix + '/' + type + '/' + this.config.centerLicense + '/' + deviceUUID + '');
    this.mqttClient.unsubscribe(this.config.mqttPrefix + '/' + type + '/' + this.config.centerLicense + '/' + deviceUUID + '', callback);
};

module.exports = SiotGateway;