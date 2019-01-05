"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * ----------------------
 * Common models
 */
var BlockModel = /** @class */ (function () {
    function BlockModel(rawBlock) {
    }
    return BlockModel;
}());
exports.BlockModel = BlockModel;
var TxModel = /** @class */ (function () {
    function TxModel(rawTx) {
    }
    return TxModel;
}());
exports.TxModel = TxModel;
var TendermintClient = /** @class */ (function () {
    function TendermintClient() {
    }
    TendermintClient.prototype.test = function () {
        return 'ok';
    };
    return TendermintClient;
}());
exports.TendermintClient = TendermintClient;
//# sourceMappingURL=index.js.map