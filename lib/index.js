"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TendermintClient = exports.TendermintClientWS = void 0;

var _block = require("./models/block");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// const { decode } = require('msgpack-lite');
var Observable = require('zen-observable');

var WS = require('ws'); // import { TxModel } from './models/tx';


var TendermintClientWS =
/*#__PURE__*/
function () {
  // Ws connection
  // Observer events
  function TendermintClientWS(globalProps) {
    _classCallCheck(this, TendermintClientWS);

    _defineProperty(this, "connection", void 0);

    _defineProperty(this, "options", void 0);

    _defineProperty(this, "isNode", false);

    _defineProperty(this, "isSynced", void 0);

    _defineProperty(this, "$eventsSubscription", void 0);

    this.isSynced = false;
    this.isNode = typeof window === 'undefined';
    this.options = globalProps.options;
  }
  /*
   * RPC methods
   */

  /*
   * Connect to node via web socket
   * subscribe to NewBlocks, NewTxs(optional)
   * emit data through observable pattern
   */


  _createClass(TendermintClientWS, [{
    key: "connect",
    value: function connect() {
      var _this = this;

      this.$eventsSubscription = new Observable(function (observable) {
        /*
         * WebSocket events handlers
         */
        var messageHandler = function messageHandler(event) {
          // Differences formats of ws class for node and browser
          var parsedEvent = _this.isNode ? JSON.parse(event) : JSON.parse(event.data);
          var eventData = parsedEvent.result.data;

          if (eventData) {
            // Block
            if (eventData.type === 'tendermint/event/NewBlock') {
              observable.next(new _block.BlockModel(eventData.value.block));
            } // Transaction
            else if (eventData.type === 'tendermint/event/NewTx') {
                observable.next(new _block.BlockModel(eventData.value));
              }
          } else {
            observable.next(parsedEvent);
          }
        };

        var openHandler = function openHandler() {
          _this.isSynced = true;
          console.log('Connected to node web socket');

          _this.subscribe('blocks');
        };

        var closeHandler = function closeHandler(error) {
          _this.connection = null;
          _this.isSynced = false;
          console.error('Error in web socket connection:', error);
        };

        var errorHandler = function errorHandler(error) {
          console.error('Socket error:', error);
          observable.complete();
        };
        /*
         * Use different realisations to call
         * of WebSockets for browser and node
         */


        try {
          var wsUrl = "".concat(_this.options.node_ws, "/websocket"); // for nodejs

          if (_this.isNode) {
            _this.connection = new WS(wsUrl);

            _this.connection.on('open', function () {
              return openHandler();
            });

            _this.connection.on('close', function (error) {
              return closeHandler(error);
            });

            _this.connection.on('error', function (error) {
              return errorHandler(error);
            });

            _this.connection.on('message', function (event) {
              return messageHandler(event);
            });
          } // for browsers
          else {
              _this.connection = new WebSocket(wsUrl);

              _this.connection.onopen = function () {
                return openHandler();
              };

              _this.connection.onclose = function (error) {
                return closeHandler(error);
              };

              _this.connection.onerror = function (error) {
                return errorHandler(error);
              };

              _this.connection.onmessage = function (event) {
                return messageHandler(event);
              };
            }
        } catch (e) {
          console.error("Error in web socket connection: ".concat(e));
          observable.complete();
        }
      });
    }
    /*
     * Static commands for ws
     * of Tendermint node
     */

  }, {
    key: "subscribe",
    value: function subscribe(to) {
      try {
        if (to === 'blocks') {
          this.connection.send(JSON.stringify({
            id: 'explorer-sub-to-blocks',
            jsonrpc: '2.0',
            method: 'subscribe',
            params: {
              query: 'tm.event=\'NewBlock\''
            }
          }));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }]);

  return TendermintClientWS;
}();
/*
 * Main class
 */


exports.TendermintClientWS = TendermintClientWS;

var TendermintClient =
/*#__PURE__*/
function (_TendermintClientWS) {
  _inherits(TendermintClient, _TendermintClientWS);

  // Last sync node status
  function TendermintClient(options) {
    var _this2;

    _classCallCheck(this, TendermintClient);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(TendermintClient).call(this, {
      options: options
    }));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "options", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "status", void 0);

    _this2.options = options;
    return _this2;
  }

  _createClass(TendermintClient, [{
    key: "test",
    value: function test() {
      return 'ok';
    }
  }]);

  return TendermintClient;
}(TendermintClientWS);

exports.TendermintClient = TendermintClient;