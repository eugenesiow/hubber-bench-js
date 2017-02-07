var cluster = require( 'cluster' );
var numCPUs = require( 'os' ).cpus().length;
var fs = require('fs');

var clientsToCreate = process.argv[2];
var totalClients = process.argv[3];
var perCore = Math.round(clientsToCreate / numCPUs);
var clientData = {};
console.log(perCore + " clients per core");

if( cluster.isMaster ) {
	for( var i = 0; i < numCPUs; i++ ) {
		setTimeout( startDeepstreamClientBatchProcess.bind( null,  perCore), 1000 );
	}

	cluster.on( 'exit', onDeepstreamClientExited );
	// cluster.on( 'online', onDeepstreamClientStarted );	
} else {
	fs.readFile('ca-GrQc-ps.json', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}
		clientData = JSON.parse(data);

		var processID = Number( process.env.firstClientID );
		for( var i = 0; i < process.env.clientAmount; i++ ) {
			setTimeout( startDeepstreamClient(processID+i,clientData[processID+i]), 100 );
		}
	});
}

function startDeepstreamClientBatchProcess( clientAmount ) {
	cluster.fork( {
		clientAmount: clientAmount,
		firstClientID: totalClients
	} );
	totalClients = Number(totalClients + clientAmount);
}

function startDeepstreamClient( clientID, subscribers ) {
	return function() {
		console.log( 'Starting client pair:' + clientID + ' with subscribers: ' + subscribers);
		require( './client' )( clientID, subscribers);
	}
}

function onDeepstreamClientExited( worker, code, signal ) {
	if( signal ) {
		console.log( "Worker was killed by signal: " + signal );
	} else if( code !== 0 ) {
		console.log( "Worker exited with error code: " + code );
	}
}