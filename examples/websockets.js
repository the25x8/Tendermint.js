const { TendermintJs, SocketClient } = require('../lib/tendermint.js');

const options = {
	node_rpc: 'http://localhost:26657',
	node_ws: 'ws://localhost:26657',
	logs: true
};

// SocketClient class tests
// const blocks = [];
//
// const tmWsInstance = new SocketClient(options);
//
// tmWsInstance
// 	.connect()
// 	.then(() => {
// 		tmWsInstance.subscribe('blocks');
// 		console.log('Web socket is connected');
// 	})
// 	.catch(() => {
// 		console.error('Web socket connection error');
// 	});
//
// tmWsInstance.$socketEventsSubscription.subscribe(data => {
// 	blocks.push(data);
// 	console.log(blocks);
// });

// Tests for TendermintJs socket wrapper
const tmJs = new TendermintJs(options);

// Connect to ws
tmJs.connect()
	.then(() => {
		console.log('Test: Connected to ws - ok');
	}).catch(() => {
		console.log('Test: Connected to ws - error');
	});

// Subscribe to events
tmJs.socket.$events.subscribe(data => {
	console.log(data);
});