var cluster = require( 'cluster' );
var numCPUs = require( 'os' ).cpus().length;
var fs = require('fs');

var clientsToCreate = process.argv[2];
var totalClients = process.argv[3];
var fileName = process.argv[4];
var perCore = Math.round(clientsToCreate / numCPUs);
var clientData = {};
console.log(perCore + " clients per core");

if( cluster.isMaster ) {
	for( var i = 0; i < numCPUs; i++ ) {
		setTimeout( startClientBatchProcess.bind( null,  perCore), 1000 );
	}

	cluster.on( 'exit', onClientExited );
	// cluster.on( 'online', onDeepstreamClientStarted );	
} else {
	var processID = Number( process.env.firstClientID );
	for( var i = 0; i < process.env.clientAmount; i++ ) {
		setTimeout( startClient(processID+i,[processID+i], 100 ));
	}
}

function startClientBatchProcess( clientAmount ) {
	cluster.fork( {
		clientAmount: clientAmount,
		firstClientID: totalClients
	} );
	totalClients = Number(totalClients) + Number(clientAmount);
}

function startClient( clientID, subscribers ) {
	return function() {
		console.log( 'Starting client pair:' + clientID + ' with subscribers: ' + subscribers);
		require( './client-mqtt' )( clientID, subscribers);
	}
}

function onClientExited( worker, code, signal ) {
	if( signal ) {
		console.log( "Worker was killed by signal: " + signal );
	} else if( code !== 0 ) {
		console.log( "Worker exited with error code: " + code );
	}
}