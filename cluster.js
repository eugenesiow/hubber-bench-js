var cluster = require( 'cluster' );
var numCPUs = require( 'os' ).cpus().length;

var totalClients = 0;
console.log(numCPUs);

if( cluster.isMaster ) {
	for( var i = 0; i < numCPUs; i++ ) {
		setTimeout( startDeepstreamClientBatchProcess.bind( null, 1 ), 10000 );
	}

	cluster.on( 'exit', onDeepstreamClientExited );
	// cluster.on( 'online', onDeepstreamClientStarted );
} else {
	var processID = Number( process.env.firstClientID );
	for( var i = 0; i < process.env.clientAmount; i++ ) {
		setTimeout( startDeepstreamClient(processID+i), 10000 );
	}
}

function startDeepstreamClientBatchProcess( clientAmount ) {
	cluster.fork( {
		clientAmount: clientAmount,
		firstClientID: totalClients
	} );
	totalClients = totalClients + clientAmount;
}

function startDeepstreamClient( clientID ) {
	return function() {
		console.log( 'Starting client pair:', clientID );
		require( './client' )( clientID);
	}
}

function onDeepstreamClientExited( worker, code, signal ) {
	if( signal ) {
		console.log( "Worker was killed by signal: " + signal );
	} else if( code !== 0 ) {
		console.log( "Worker exited with error code: " + code );
	}
}