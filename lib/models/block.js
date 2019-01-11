"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BlockModel = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BlockModel = function BlockModel(rawBlock) {
  _classCallCheck(this, BlockModel);

  _defineProperty(this, "last_commit", void 0);

  _defineProperty(this, "data", void 0);

  _defineProperty(this, "header", void 0);

  _defineProperty(this, "block_meta", void 0);

  this.last_commit = rawBlock.last_commit;
  this.block_meta = rawBlock.block_meta;
  this.header = rawBlock.header;
  this.data = rawBlock.data;
};

exports.BlockModel = BlockModel;