"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TendermintClient = exports.TxModel = exports.BlockModel = void 0;

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Block interfaces
 */

/*
 * -------------------
 * Transaction interfaces
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

exports.TxModel = TxModel;

var TendermintClient =
/*#__PURE__*/
function () {
  function TendermintClient() {
    _classCallCheck(this, TendermintClient);
  }

  _createClass(TendermintClient, [{
    key: "test",
    value: function test() {
      return 'ok';
    }
  }]);

  return TendermintClient;
}();

exports.TendermintClient = TendermintClient;