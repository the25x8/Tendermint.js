const { TendermintClient } = require('../lib/index');

const blocks = [];
const instance = new TendermintClient({
	node_rpc: 'http://localhost:26657',
	node_ws: 'ws://localhost:26657'
});

instance.connect({
	subscribeTo: ['blocks']
});

if (!instance.$socketEventsSubscription) {
	console.error('Web socket connection error');
}

instance.$socketEventsSubscription.subscribe(data => {
	blocks.push(data);
	console.log(blocks);
});