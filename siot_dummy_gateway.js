/**
 * Created by roger on 10/27/15.
 */
var siot = require('./index.js');
var async = require('async');

var gateway = new siot.gateway({
    clientId: "INSERT ACCOUNT ID HERE - ONLY NEEDED IF YOU WANT TO DISCOVER YOUR AVAILABLE LICENSES",
    centerLicense: "INSERT LICENSE HERE"
});

var sensor = new siot.sensor({
    uuid: "29d265c1-daf0-4a91-a1d9-45e48239728b",
    name: "SensorTest1",
    valueType: "text"
});

var actor = new siot.actor({
    uuid: "71e36799-25f5-4b7f-882f-041f5104add7",
    name: "ActorTest1",
    valueType: "text"
});

async.series([

        function (done) {
            gateway.registerDevice(sensor, done)
        },
        function (done) {
            gateway.registerDevice(actor, done)
        },
        function (done) {
            gateway.connect(done)
        },
        function (done) {
            sensor.sendSensorData("test", done)
        }
    ],
    function (err) {
        if (err) return console.error(err);

        actor.on('siot_data', function(message) {

            console.log('received data for actor:', message);

        });

        console.log("setup complete");
});

