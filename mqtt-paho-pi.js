var fs = require('fs');
const mqtt = require('paho-mqtt')  
const client = new mqtt.MQTT.Client('192.168.0.100', 1883)

var clientId = process.argv[2];
var time = process.argv[3];
var fileName = process.argv[4];
var ext = process.argv[5];
var map = {};
var log_file = fs.createWriteStream(__dirname + '/results_'+ext+'_mqtt/'+clientId+'.log', {flags : 'w'});

console.log(clientId);

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
client.connect({onSuccess:subscriptionBench});

function subscriptionBench() {
	fs.readFile(fileName, 'utf8', function (err,data) {
	  if (err) {
	    return console.log(err);
	  }
	  map = JSON.parse(data);
	  friends = map[clientId];

	  for(var i in friends) {
			client.subscribe('test/test'+friends[i]);
		}

	  setTimeout(finish,Number(time)*1000);
	});	
}

// called when a message arrives
function onMessageArrived(message) {
  	var d = new Date();
	var arr = message.toString().split(",");
	var diff = d.getTime() - Number(arr[0]);
	log_file.write(diff+'\n');
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

function finish() {
	client.end();
}