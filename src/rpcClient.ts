// Polyfills
require('es6-promise').polyfill();
require('@babel/polyfill');

import axios, { AxiosError, AxiosResponse } from 'axios';

import { IGlobalOptions } from './index';
// import { BlockModel } from './models/block';
// import { TxModel } from './models/tx';

export interface IAbciInfo {
  response: {
    data: any;
    version: string;
    app_version: string;
  };
}

interface IVoteSet {
  round: string;
  prevotes: string[];
  prevotes_bit_array: string;
  precommits: string[];
  precommits_bit_array: string;
}

export interface IConsensusState {
  round_state: {
    'height/round/step': string;
    start_time: string;
    proposal_block_hash: string;
    locked_block_hash: string;
    valid_block_hash: string;
    height_vote_set: IVoteSet[];
  };
}

export class RpcClient {
  private options: IGlobalOptions;

  constructor(options: IGlobalOptions) {
    this.options = options;
  }

  // ----------------------
  // Wrappers of RPC methods
  public async abciInfo(): IAbciInfo {
    return await this.get('abci_info');
  }

  public async consensusState(): IConsensusState {
    return await this.get('consensus_state');
  }

  // ----------------------
  // Universal get wrapper
  public async get(method: string): object {
    try {
      const res: AxiosResponse =
        await axios.get(`${this.options.node_rpc}/${method}`);

      if (res.status === 200) {
        return res.data.result;
      }
    } catch (error) {
      this.logError(error);
    }
  }

  // -------------------------
  // Print error info
  private logError(error: AxiosError) {
    if (this.options.logs) {
      if (error.response) {
        console.log('Data:\n', error.response.data);
        console.log('Status:\n', error.response.status);
        console.log('Headers:\n', error.response.headers);
      } else if (error.request) {
        console.log('Request:\n', error.request);
      } else {
        console.log('Error:\n', error.message);
      }
      console.log('Config:\n', error.config);
    }
  }
}
