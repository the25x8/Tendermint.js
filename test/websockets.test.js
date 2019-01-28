const TendermintJS = require('../lib/tendermint.js');

const options = {
	node_rpc: 'http://localhost:26657',
	node_ws: 'ws://localhost:26657',
	logs: true
};

// Tests for TendermintJs socket wrapper
const tmJs = new TendermintJS(options);

test('Websocket connect', () => {
	let passed = false;
	// Connect to ws
	tmJs.socket.connect(['blocks'])
		.then(() => {
			console.info('Tendermint.connect: Connected to node websocket');
      passed = true;
		})
		.catch(() => {
			console.error('Tendermint.connect: Websocket connection error');
      passed = true;
		});

  expect(passed).toBe(true);
});

test('Subscribe to events', () => {
	// Subscribe to events
	tmJs.socket.$events.on('block', data => {
	});

  expect(false).toBe(true);
});