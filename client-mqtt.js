const mqtt = require('mqtt')  

module.exports = function(clientId,subscribers) {
	const client = mqtt.connect('mqtt://localhost:1883')  
	client.on('connect', () => {
		for(var i in subscribers) {
			client.subscribe('test/test'+subscribers[i]);
		}
	});
	client.on('message', (topic, message) => {  
		var d = new Date();
		var arr = message.toString().split(",");
		var diff = d.getTime() - Number(arr[0]);
		// console.log(diff);
	})
}