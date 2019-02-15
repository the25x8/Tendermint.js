# Tendermint.js
The simple and minimalistic library to get blockchain data from Tendermint node.

---

### Install
`npm i tendermint.js` or `yarn add tendermint.js`

### Test
`npm run test`

---

### Usage
You can use this library on your node and browser too. See [examples folder](https://github.com/cryptoji/Tendermint.js/tree/master/examples) for getting more information.

#### Import library
##### ES6 imports
```javascript
import TendermintJS from 'tendermint.js'
```
###### Require
```javascript
var TendermintJS = require('tendermint.js')
```
###### Browser
```html
<script src="YOUR_PATH/tendermint.umd.js"></script>
```

#### Create a reference to the instance
```javascript
const options = {
  node_rpc: 'http://localhost:26657',
  node_ws: 'ws://localhost:26657',
  logs: true
};

const tm = new TendermintJS(options);
```

#### Connect to node via web sockets
```javascript
// Connect to node and subscribe to some events
tmJs.socket.connect({ subscribe: ['blocks', 'txs'] })
  .then(() => {

    // Alt subscribe way
    // tmJs.socket.action('subscribe', 'blocks');
    // tmJs.socket.action('subscribe', 'txs');

    // Unsubscribe out events tests
    setTimeout(() => {
      tmJs.socket.action('unsubscribe', 'blocks');
      tmJs.socket.action('unsubscribe', 'txs');
    }, 5000);
  })
  .catch(() => {});

// Subscribe to block chain events
tmJs.socket.$events.on('block', (block) => {
  console.log(block);
});

tmJs.socket.$events.on('tx', (tx) => {
  console.log(tx);
});

// Remove event listener
tmJs.socket.$events.off('tx');
```