## Classes

<dl>
<dt><a href="#SiotGateway">SiotGateway</a></dt>
<dd></dd>
<dt><a href="#SiotDevice">SiotDevice</a></dt>
<dd></dd>
<dt><a href="#SiotActor">SiotActor</a></dt>
<dd></dd>
<dt><a href="#SiotSensor">SiotSensor</a></dt>
<dd></dd>
</dl>

<a name="SiotGateway"></a>
## SiotGateway
**Kind**: global class  

* [SiotGateway](#SiotGateway)
    * [new SiotGateway(config)](#new_SiotGateway_new)
    * [.getLicenseList(clientid, callback)](#SiotGateway+getLicenseList)
    * [.retrieveCenterURLs(licenseKey, callback)](#SiotGateway+retrieveCenterURLs)
    * [.retrieveManifest(sensorUUID, callback)](#SiotGateway+retrieveManifest)
    * [.connect(callback)](#SiotGateway+connect)
    * [.disconnect(force, callback)](#SiotGateway+disconnect)
    * [.handleMessage(topic, message)](#SiotGateway+handleMessage)
    * [.registerDevice(device, callback)](#SiotGateway+registerDevice)
    * [.unregisterDevice(device, callback)](#SiotGateway+unregisterDevice)
    * [.publish(deviceUUID, type, payloadString, callback)](#SiotGateway+publish)
    * [.subscribe(deviceUUID, type, callback)](#SiotGateway+subscribe)
    * [.unsubscribe(deviceUUID, type, callback)](#SiotGateway+unsubscribe)

<a name="new_SiotGateway_new"></a>
### new SiotGateway(config)
[SiotGateway]
this class represents the siot.net gateway


| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the gateway config |

<a name="SiotGateway+getLicenseList"></a>
### siotGateway.getLicenseList(clientid, callback)
get the list of available licences of e specified client

**Kind**: instance method of <code>[SiotGateway](#SiotGateway)</code>  

| Param | Type | Description |
| --- | --- | --- |
| clientid | <code>string</code> | the id of the client |
| callback | <code>function</code> | the result |

<a name="SiotGateway+retrieveCenterURLs"></a>
### siotGateway.retrieveCenterURLs(licenseKey, callback)
get the url of the siot center and its mqtt broker

**Kind**: instance method of <code>[SiotGateway](#SiotGateway)</code>  

| Param | Type | Description |
| --- | --- | --- |
| licenseKey | <code>string</code> | license key of the siot center |
| callback | <code>function</code> | the result |

<a name="SiotGateway+retrieveManifest"></a>
### siotGateway.retrieveManifest(sensorUUID, callback)
get the manifest from a device

**Kind**: instance method of <code>[SiotGateway](#SiotGateway)</code>  

| Param | Type | Description |
| --- | --- | --- |
| sensorUUID | <code>string</code> | license key of the siot center |
| callback | <code>function</code> | the result |

<a name="SiotGateway+connect"></a>
### siotGateway.connect(callback)
connects to the siot center

**Kind**: instance method of <code>[SiotGateway](#SiotGateway)</code>  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | the result |

<a name="SiotGateway+disconnect"></a>
### siotGateway.disconnect(force, callback)
disconnects the siot center connection

**Kind**: instance method of <code>[SiotGateway](#SiotGateway)</code>  

| Param | Type | Description |
| --- | --- | --- |
| force | <code>boolean</code> | true = do not await acknowledge |
| callback | <code>function</code> | the result |

<a name="SiotGateway+handleMessage"></a>
### siotGateway.handleMessage(topic, message)
handles an incoming message

**Kind**: instance method of <code>[SiotGateway](#SiotGateway)</code>  

| Param | Type |
| --- | --- |
| topic | <code>string</code> | 
| message | <code>string</code> | 

<a name="SiotGateway+registerDevice"></a>
### siotGateway.registerDevice(device, callback)
registers a new sensor/actor and publish their manifest. If the gateway is not connected, then the manifest will be send once the gateway is connected.

**Kind**: instance method of <code>[SiotGateway](#SiotGateway)</code>  

| Param | Type | Description |
| --- | --- | --- |
| device | <code>object</code> | the Siot Device which should be registered |
| callback | <code>function</code> | the result |

<a name="SiotGateway+unregisterDevice"></a>
### siotGateway.unregisterDevice(device, callback)
registers a new sensor

**Kind**: instance method of <code>[SiotGateway](#SiotGateway)</code>  

| Param | Type | Description |
| --- | --- | --- |
| device | <code>object</code> | the Siot Device which should be registered |
| callback | <code>function</code> | the result |

<a name="SiotGateway+publish"></a>
### siotGateway.publish(deviceUUID, type, payloadString, callback)
publishs the payload according to the siot topic structure

**Kind**: instance method of <code>[SiotGateway](#SiotGateway)</code>  

| Param | Type | Description |
| --- | --- | --- |
| deviceUUID | <code>string</code> |  |
| type | <code>string</code> |  |
| payloadString | <code>string</code> |  |
| callback | <code>function</code> | the result |

<a name="SiotGateway+subscribe"></a>
### siotGateway.subscribe(deviceUUID, type, callback)
subscribe for messages according to the siot topic structure

**Kind**: instance method of <code>[SiotGateway](#SiotGateway)</code>  

| Param | Type | Description |
| --- | --- | --- |
| deviceUUID | <code>string</code> |  |
| type | <code>string</code> |  |
| callback | <code>function</code> | the result |

<a name="SiotGateway+unsubscribe"></a>
### siotGateway.unsubscribe(deviceUUID, type, callback)
unsubscribe

**Kind**: instance method of <code>[SiotGateway](#SiotGateway)</code>  

| Param | Type | Description |
| --- | --- | --- |
| deviceUUID | <code>string</code> |  |
| type | <code>string</code> |  |
| callback | <code>function</code> | the result |

<a name="SiotDevice"></a>
## SiotDevice
**Kind**: global class  

* [SiotDevice](#SiotDevice)
    * [new SiotDevice(config)](#new_SiotDevice_new)
    * [.register(gatewayReference, callback)](#SiotDevice+register)
    * [.unregister(callback)](#SiotDevice+unregister)
    * [.handleMessage(type, topic, message)](#SiotDevice+handleMessage)

<a name="new_SiotDevice_new"></a>
### new SiotDevice(config)
[SiotDevice]
base class for the siot.net devices


| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the gateway config |

<a name="SiotDevice+register"></a>
### siotDevice.register(gatewayReference, callback)
sends the device manifest to the center and subscribe its config topic

**Kind**: instance method of <code>[SiotDevice](#SiotDevice)</code>  

| Param | Type | Description |
| --- | --- | --- |
| gatewayReference | <code>object</code> | the gateway |
| callback | <code>function</code> | the result |

<a name="SiotDevice+unregister"></a>
### siotDevice.unregister(callback)
unregisters this siot device and unsubscribe its topics

**Kind**: instance method of <code>[SiotDevice](#SiotDevice)</code>  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | the result |

<a name="SiotDevice+handleMessage"></a>
### siotDevice.handleMessage(type, topic, message)
parses the retrieved mqtt message and emit to corresponding events

**Kind**: instance method of <code>[SiotDevice](#SiotDevice)</code>  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | the siot message type |
| topic | <code>string</code> | the mqtt topic |
| message | <code>string</code> | the message |

<a name="SiotActor"></a>
## SiotActor
**Kind**: global class  
<a name="new_SiotActor_new"></a>
### new SiotActor(config)
[SiotActor]
This class represents an siot.net actor


| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the gateway config |

<a name="SiotSensor"></a>
## SiotSensor
**Kind**: global class  

* [SiotSensor](#SiotSensor)
    * [new SiotSensor(config)](#new_SiotSensor_new)
    * [.sendSensorData(data, callback)](#SiotSensor+sendSensorData)
    * [.sendRawData(data, callback)](#SiotSensor+sendRawData)

<a name="new_SiotSensor_new"></a>
### new SiotSensor(config)
[SiotSensor]
This class represents a siot


| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | the gateway config |

<a name="SiotSensor+sendSensorData"></a>
### siotSensor.sendSensorData(data, callback)
send data formmatted as serialised json. JSON structure: { time: CURRENTTIME, value: DATA}

**Kind**: instance method of <code>[SiotSensor](#SiotSensor)</code>  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>string</code> | the data to be send as string |
| callback | <code>function</code> | the result |

<a name="SiotSensor+sendRawData"></a>
### siotSensor.sendRawData(data, callback)
send data raw and only formatted as string

**Kind**: instance method of <code>[SiotSensor](#SiotSensor)</code>  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>string</code> | the data to be send as string |
| callback | <code>function</code> | the result |

