"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.TendermintClient=exports.TxModel=exports.BlockModel=void 0;function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var _require=require("msgpack-lite"),decode=_require.decode,Observable=require("zen-observable"),WS=require("ws"),BlockModel=function a(b){_classCallCheck(this,a),_defineProperty(this,"last_commit",void 0),_defineProperty(this,"data",void 0),_defineProperty(this,"header",void 0),_defineProperty(this,"block_meta",void 0),this.last_commit=b.last_commit,this.block_meta=b.block_meta,this.header=b.header,this.data=b.data};exports.BlockModel=BlockModel;var TxModel=function a(){_classCallCheck(this,a)};/*
 * Main class
 */exports.TxModel=TxModel;var TendermintClient=/*#__PURE__*/function(){// Last sync node status
// Observer events
// Select platform
// Ws connection
function a(b){_classCallCheck(this,a),_defineProperty(this,"status",void 0),_defineProperty(this,"events",void 0),_defineProperty(this,"isSynced",void 0),_defineProperty(this,"isNode",void 0),_defineProperty(this,"connection",void 0),_defineProperty(this,"options",void 0),this.options=b,this.isSynced=!1,this.isNode="undefined"==typeof window}/*
	 * Connect to node via web socket
	 * subscribe to NewBlocks, NewTxs(optional)
	 * emit data through observable pattern
	 */return _createClass(a,[{key:"connect",value:function b(){var a=this;this.events=new Observable(function(b){/*
			 * WebSocket events handlers
			 */var c=function(c){// In browser ws event is json
var d=a.isNode?JSON.parse(c):JSON.parse(c.data),e=d.result.data;e?"tendermint/event/NewBlock"===e.type?b.next(new BlockModel(e.value.block)):"tendermint/event/NewTx"===e.type&&b.next(new BlockModel(e.value)):b.next(d)},d=function(){a.isSynced=!0,a.subscribeToBlocks(),console.log("Connected to node web socket")},e=function(b){a.connection=null,a.isSynced=!1,console.error("Error in web socket connection:",b)},f=function(a){console.error("Socket error:",a),b.complete()};/*
			 * Use different realisations to call
			 * of WebSockets for browser and node
			 */try{var g="".concat(a.options.node_ws,"/websocket");// for nodejs
a.isNode?(a.connection=new WS(g),a.connection.on("open",function(){return d()}),a.connection.on("close",function(a){return e(a)}),a.connection.on("error",function(a){return f(a)}),a.connection.on("message",function(a){return c(a)})):(a.connection=new WebSocket(g),a.connection.onopen=function(){return d()},a.connection.onclose=function(a){return e(a)},a.connection.onerror=function(a){return f(a)},a.connection.onmessage=function(a){return c(a)})}catch(a){console.error("Error in web socket connection: ".concat(a)),b.complete()}})}/*
	 * Static commands for ws
	 * of Tendermint node
	 */},{key:"subscribeToBlocks",value:function a(){try{this.connection.send(JSON.stringify({id:"explorer-sub-to-blocks",jsonrpc:"2.0",method:"subscribe",params:{query:"tm.event='NewBlock'"}}))}catch(a){console.error(a)}}},{key:"test",value:function a(){return"ok"}}]),a}();exports.TendermintClient=TendermintClient;
