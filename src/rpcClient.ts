// const { decode } = require('msgpack-lite');
import Axios from 'axios';

import { BlockModel } from './models/block';
import { TxModel } from './models/tx';

export interface IClientOptions {
  node_rpc: string;
  node_ws: string;
  logs: boolean;
}

/*
 * TM RPC class and interfaces
 */
export interface ISearchByQuery {
  perPage: number;
  page: number;
  prove: boolean;
  query: string;
}

export class RpcClient {
  private options: IClientOptions;

  constructor(options: IClientOptions) {
    this.options = options;
  }

  // Get chain status
  public async getStatus(): object {
    const response = await Axios.get(`${this.options.node_rpc}/status`);

    if (!response || !response.data || !response.data.result) { return; }
    if (this.options.logs) {
      console.log('Tendermint/Info: getStatus\n', response.data.result);
    }

    return response.data.result;
  }

  // Get block by height
  public async getBlockByHeight(height = 1): BlockModel {
    if (height <= 0) { height = 1; }

    const response = await Axios.get(`${this.options.node_rpc}/block`, { params: { height } });
    if (!response || !response.data || !response.data.result || !response.data.result.block) {

      if (this.options.logs) {
        console.warn('Error: Could not get block by height\n');
      }

      return;
    }

    const block = new BlockModel(response.data.result);

    if (this.options.logs) {
      console.log('Tendermint/Info: getBlockByHeight\n', block);
    }

    return block;
  }

  // Get last N blocks
  public async getRecentBlocks(options: { limit, maxHeight, minHeight }): BlockModel[] {
    let { limit, maxHeight, minHeight } = options;

    // Set default limit
    if (limit <= 0) { limit = 10; }

    // Calculate min and and max value if they are empty
    if (!maxHeight || !minHeight) {
      const status = await this.getStatus();
      if (!status || !status.sync_info) { return []; }

      maxHeight = status.sync_info.latest_block_height;

      // Standard case
      if (maxHeight > limit && limit !== 1) {
        minHeight = maxHeight - limit;
      } else if (maxHeight > limit && limit === 1) {
        minHeight = maxHeight;
      } else {
        minHeight = 1;
        maxHeight = limit;
      }
    }

    const response = await Axios.get(`${this.options.node_rpc}/blockchain`, {
      params: { minHeight, maxHeight },
    });

    const data = response.data.result;
    if (!data || !data.block_metas) { return []; }

    return data.block_metas.map((rawBlock) => new BlockModel(rawBlock));
  }

  // Get transaction data by hash
  public async getTransactionByHash(rawHash: string): TxModel {
    const hash = rawHash.substring(0, 2) === '0x' ? rawHash : `0x${rawHash}`;
    const response = await Axios.get(`${this.options.node_rpc}/tx`, { params: { prove: true, hash } });

    const data = response.data;
    if (data.error) { return data.error; }

    if (data.result && data.result.hash && data.result.height) {

      // Create TxModel
      const tx = new TxModel(data.result);
      console.log('Tendermint/Info: getTransactionByHash\n', tx);

      return tx;
    }

    return { error: 'Not a transaction' };
  }

  // Get transactions by query
  public async searchByQuery(params: ISearchByQuery): object {
    params = {
      perPage: params.perPage || 100,
      page: params.page || 1,
      prove: params.prove || true,
      query: `${params.query}` || '',
    };

    const response = await Axios.get(`${this.options.node_rpc}/tx_search`, { params });
    if (!response || !response.data || !response.data.result) { return {}; }

    const data = response.data.result;
    data.txs = data.txs.map((tx) => new TxModel(tx));

    return data;
  }
}
