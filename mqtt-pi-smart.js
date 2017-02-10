var fs = require('fs');
const mqtt = require('mqtt')  
const client = mqtt.connect('mqtt://192.168.0.100:1883')  

var clientId = process.argv[2];
var time = process.argv[3];
var fileName = process.argv[4];
var ext = process.argv[5];
var map = {};
var log_file = fs.createWriteStream(__dirname + '/results_'+ext+'_mqtt/'+clientId+'.log', {flags : 'w'});

console.log(clientId);
client.on('connect', () => {
  	subscriptionBench();
});

client.on('error', (error) => {
	console.log(error);
})

function subscriptionBench() {
	client.subscribe('test/test'+clientId);
	setTimeout(finish,Number(time)*1000);
}

client.on('message', (topic, message) => {  
	var d = new Date();
	var arr = message.toString().split(",");
	var diff = d.getTime() - Number(arr[0]);
	log_file.write(diff+'\n');
})

function finish() {
	client.end();
}