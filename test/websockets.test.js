const TendermintJS = require('../lib/tendermint.js');

const options = {
	node_rpc: 'http://localhost:26657',
	node_ws: 'ws://localhost:26657',
	logs: true
};

// Tests for TendermintJs socket wrapper
const tmJs = new TendermintJS(options);

test('Websocket connect', () => {
	// Connect to ws
	tmJs.socket.connect(['blocks'])
		.then(() => {
			console.info('Tendermint.connect: Connected to node websocket');
		})
		.catch(() => {
			console.error('Tendermint.connect: Websocket connection error');
		});
});

test('Websocket subscribe to events', () => {
	// Subscribe to events
	tmJs.socket.$events.subscribe(data => {
		console.log(data);
	});
});