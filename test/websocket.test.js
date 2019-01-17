const { TendermintClient } = require('../lib/index');

const instance = new TendermintClient({
	node_rpc: 'http://localhost:26657',
	node_ws: 'ws://localhost:26657'
});

instance.connect();
instance.subscribe('blocks');

instance.$eventsSubscription.subscribe(data => {
	console.log(data);
});