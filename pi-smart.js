var deepstream = require('deepstream.io-client-js')
var fs = require('fs');

var deepstreamURL = '192.168.0.100:6020';
var ds = deepstream( deepstreamURL ,{
	subscriptionTimeout: 20000
});
const client = ds.login();

var clientId = process.argv[2];
var time = process.argv[3];
var log_file = fs.createWriteStream(__dirname + '/results/'+clientId+'.log', {flags : 'w'});

console.log(clientId);
subscriptionBench();
setTimeout(finish,Number(time)*1000);

function subscriptionBench() {
	client.event.subscribe('test/test'+clientId, eventCallback);
}

function finish() {
	client.close();
}

function eventCallback(data) {
	var d = new Date();
	var diff = d.getTime() - Number(data[1]);
	log_file.write(diff+'\n');
}
