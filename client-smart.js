var deepstream = require('deepstream.io-client-js')

module.exports = function(clientId,subscribers) {
	var deepstreamURL = '192.168.0.100:6020';
	var ds = deepstream( deepstreamURL ,{
		subscriptionTimeout: 20000
	});
	const client = ds.login();
	client.event.subscribe('test/test'+clientId, eventCallback);
	
	function eventCallback(data) {
		var d = new Date();
		var diff = d.getTime() - Number(data[1]);
		// console.log(diff);
	}
}