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

var WebSocket = require('ws');
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

    _defineProperty(this, "options", void 0);

    _defineProperty(this, "connection", void 0);

    this.options = options;
    this.isSynced = false;
  }

  _createClass(TendermintClient, [{
    key: "connect",
    value: function connect() {
      var _this = this;

      this.events = new Observable(function (observable) {
        try {
          _this.connection = new WebSocket("".concat(_this.options.node_ws, "/websocket"));

          _this.connection.onopen = function () {
            _this.isSynced = true;

            _this.subscribeToBlocks();

            _this.switchEvents(observable);

            console.log('Connected to node web socket');
          };

          _this.connection.onclose = function (error) {
            _this.connection = null;
            _this.isSynced = false;
            console.error('Error in web socket connection:', error);
          }; // On error handler


          _this.connection.onerror = function () {
            console.error('Socket error');
            observable.complete();
          };
        } catch (e) {
          console.error("Error in web socket connection: ".concat(e));
          observable.complete();
        }
      });
    }
  }, {
    key: "switchEvents",
    value: function switchEvents(observable) {
      var _this2 = this;

      try {
        this.connection.onmessage = function (event) {
          var data = _this2.parseEvent(event);

          if (!data || !data.type) return; // Tx

          if (data.type === 'tendermint/event/Tx') {
            var _tx = new TxModel(data.value);

            observable.next({
              type: 'Tx',
              data: _tx
            });
          } // block
          else if (data.type === 'tendermint/event/NewBlock') {
              var _block = new BlockModel(data.value.block);

              observable.next({
                type: 'Block',
                data: _block
              });
            }
        };
      } catch (e) {
        console.error(e);
      }
    }
  }, {
    key: "subscribeToBlocks",
    value: function subscribeToBlocks() {
      try {
        this.connection.send(JSON.stringify({
          id: "explorer-sub-to-blocks",
          jsonrpc: "2.0",
          method: "subscribe",
          params: {
            query: 'tm.event=\'NewBlock\''
          }
        }));
      } catch (e) {
        console.error(e);
      }
    }
  }, {
    key: "parseEvent",
    value: function parseEvent(event) {
      event = JSON.parse(event.data);
      if (!event || !event.result || !event.result.data) return;
      return event.result.data;
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