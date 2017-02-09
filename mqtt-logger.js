const mqtt = require('mqtt')  
const client = mqtt.connect('mqtt://192.168.0.100:1883')  

client.on('connect', () => {
  	client.subscribe('$SYS/broker/subscriptions/count');
});

client.on('message', (topic, message) => {  
	console.log(topic, message.toString());
});