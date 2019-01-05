"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TendermintClient = exports.TxModel = exports.BlockModel = void 0;

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('msgpack-lite'),
    decode = _require.decode;

var Observable = require('zen-observable');

var WS = require('ws');
/*
 * Block interfaces
 */


/*
 * ----------------------
 * Common models
 */
var BlockModel = function BlockModel(rawBlock) {
  _classCallCheck(this, BlockModel);
};

exports.BlockModel = BlockModel;

var TxModel = function TxModel(rawTx) {
  _classCallCheck(this, TxModel);
};
/*
 * Main class
 */


exports.TxModel = TxModel;

var TendermintClient =
/*#__PURE__*/
function () {
  function TendermintClient(options) {
    _classCallCheck(this, TendermintClient);

    _defineProperty(this, "status", void 0);

    _defineProperty(this, "events", void 0);

    _defineProperty(this, "isSynced", void 0);

    _defineProperty(this, "isNode", void 0);

    _defineProperty(this, "options", void 0);

    _defineProperty(this, "connection", void 0);

    this.options = options;
    this.isSynced = false;
    this.isNode = typeof window === 'undefined';
  }

  _createClass(TendermintClient, [{
    key: "connect",
    value: function connect() {
      var _this = this;

      this.events = new Observable(function (observable) {
        var messageHandler = function messageHandler(event) {
          if (_this.isNode) {
            observable.next(event);
          } else {
            observable.next(JSON.parse(event.data));
          }
        };

        var openHandler = function openHandler() {
          _this.isSynced = true;

          _this.subscribeToBlocks();

          console.log('Connected to node web socket');
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

        try {
          if (_this.isNode) {
            _this.connection = new WS("".concat(_this.options.node_ws, "/websocket"));

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
              _this.connection = new WebSocket("".concat(_this.options.node_ws, "/websocket"));

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
  }, {
    key: "subscribeToBlocks",
    value: function subscribeToBlocks() {
      try {
        this.connection.send(JSON.stringify({
          id: 'explorer-sub-to-blocks',
          jsonrpc: '2.0',
          method: 'subscribe',
          params: {
            query: 'tm.event=\'NewBlock\''
          }
        }));
      } catch (e) {
        console.error(e);
      }
    }
  }, {
    key: "test",
    value: function test() {
      return 'ok';
    }
  }]);

  return TendermintClient;
}();

exports.TendermintClient = TendermintClient;