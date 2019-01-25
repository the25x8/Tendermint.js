# Tendermint.js
Current version is `0.0.6`<br>
The simple and minimalistic javascript lib to get Tendermint blockchain data from node rpc and websocket

---

### Install
`npm i tendermint-js-client` or `yarn add tendermint-js-client`

### Test
`npm run test`

---

### Usage
You can use this library on your node and browser too. See [examples folder](https://github.com/cryptoji/Tendermint.js/tree/master/examples) for getting more information.

##### Import library
###### ES6 imports
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

##### Create a reference to the instance
```javascript
const tm = new TendermintJS({
    node_rpc: 'http://localhost:26657',
    node_ws: 'ws://localhost:26657',
    logs: true
});

tm.test() // return ok
```