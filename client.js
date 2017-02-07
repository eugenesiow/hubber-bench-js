var deepstream = require('deepstream.io-client-js')
// const client = deepstream('localhost:6020').login()
const client = deepstream('192.168.0.100:6020').login()
client.event.subscribe('test/test100', eventCallback);
client.event.subscribe('test/test1009', eventCallback);
client.event.subscribe('test/test60', eventCallback);
function eventCallback(data) {
	var d = new Date();
	var diff = d.getTime() - Number(data[1]);
	console.log(diff);
}