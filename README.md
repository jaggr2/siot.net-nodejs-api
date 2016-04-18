Siot.net Library
==============================

## What's Siot.net?
Siot.net is an integration platform for the internet of things. The main purpose of this platform is that
every user can easily connect smart devices together over a standardized interface. Once a thing (a smart device) is connected
to the siot.net platform, there are some basic applications availabe, i.e. display sensor values on a dashboard, etc.

To connect a thing with sensors and actors to the siot.net platform, the user has to write a gateway which acts as the bridge between them. This way, there isn't any limitation which tings can be connected to the siot.net platform as long they have some interface which a custom developed siot.net gateway can use.

This NodeJS Module implements the siot.net specification to develop such gateways. Siot.net uses MQTT as under laying messaging protocol. The siot.net specification is basically a formal description which mqtt topics with which payload format a siot.net gateway has to use for full compatibility with the siot.net ecosystem.

## Installation

```sh
npm install siot.net-nodejs-api --save
```

## Example Siot.net Gateway
In this example we instantiate a sensor and an actor and register them on the gateway. We also send some dummy sensor values and register a listener for messages for the actor.

    var siot = require('siot.net-nodejs-api'),
        async = require('async');

    var gateway = new siot.gateway({
        centerLicense: "xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx" // insert your license here
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

## API Documentation
See file [api_doc.md](api_doc.md)


## Contributing
Please just raise a pull request on GitHub.

## Copyright and license
Copyright 2016, Roger Jaggi and Pascal Bohni under [the Apache 2.0 license](LICENSE).
