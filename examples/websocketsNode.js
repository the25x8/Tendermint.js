const TendermintJS = require('../lib/tendermint.js');

const options = {
  node_rpc: 'http://localhost:26657',
  node_ws: 'ws://localhost:26657',
  logs: true
};

const tmJs = new TendermintJS(options);

// Connect to websocket
tmJs.socket.connect(['blocks', 'txs'])
  .then(() => {
    console.info('Tendermint.connect: Connected to node websocket');

    // Alt subscribe way
    // tmJs.socket.eventAction('subscribe', 'blocks');
    // tmJs.socket.eventAction('subscribe', 'txs');

    // Unsubscribe out events tests
    setTimeout(() => {
      tmJs.socket.action('unsubscribe', 'blocks');
      tmJs.socket.action('unsubscribe', 'txs');
    }, 5000);
  })
  .catch(() => console.error('Tendermint.connect: Websocket connection error'));

// Subscribe to events
tmJs.socket.$events.subscribe(data => {
  console.log(data);
});