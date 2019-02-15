const TendermintJS = require('../lib/tendermint.js');

const options = {
  node_rpc: 'http://localhost:26657',
  node_ws: 'ws://localhost:26657',
  logs: true
};

const tmJs = new TendermintJS(options);

// Connect to websocket
tmJs.socket.connect({ subscribe: ['blocks', 'txs'] })
  .then(() => {
    console.info('Tendermint.connect: Connected to node websocket');

    // Alt subscribe way
    // tmJs.socket.action('subscribe', 'blocks');
    // tmJs.socket.action('subscribe', 'txs');

    // Unsubscribe out events tests
    setTimeout(() => {
      tmJs.socket.action('unsubscribe', 'blocks');
      tmJs.socket.action('unsubscribe', 'txs');
    }, 5000);
  })
  .catch(() => console.error('Tendermint.connect: Websocket connection error'));

// Subscribe to block chain events
tmJs.socket.$events.on('block', (block) => {
  console.log(block);
});

tmJs.socket.$events.on('tx', (tx) => {
  console.log(tx);
});

// Remove event listeners
tmJs.socket.$events.off('tx');
// or listenerRef.off();