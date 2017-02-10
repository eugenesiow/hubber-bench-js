var fs = require('fs');
const mqtt = require('mqtt')  
const client = mqtt.connect('mqtt://192.168.0.100:1883')  

var clientId = process.argv[2];

var count = 0;
console.log(clientId);
client.on('connect', () => {
  	subscriptionBench();
});

client.on('error', (error) => {
	console.log(error);
})

function subscriptionBench() {
	client.subscribe('test/test'+clientId);
	// setTimeout(finish,Number(time)*1000);
}

client.on('message', (topic, message) => {  
	var d = new Date();
	var arr = message.toString().split(",");
	var diff = d.getTime() - Number(arr[0]);
	console.log(count+' '+diff+'\n');
	count++;
})

function finish() {
	client.end();
}