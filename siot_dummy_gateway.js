/**
 * Created by roger on 10/27/15.
 */
var siot = require('./index.js'),
    async = require('async');

// Weblogin
//mc2_02_9
//retoandreas
var bfhClientId = "561dfb9f19901";


var gateway = new siot.gateway({
    clientId: bfhClientId,
    //centerLicense: "5308722854616245",
    centerLicense: "8FD4-D0CB-E950-4156-B7C5-C450-BCAF-E7BE" //,
    //mqttCenterURLs: ['mqtt://india313.startdedicated.de']
    //mqttCenterURLs: ['mqtt://web:1234@formula.xrj.ch']
});

//gateway.getLicenseList(bfhClientId, function (err, result) {
//    console.log("getLicenseList OK!");
//});

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

