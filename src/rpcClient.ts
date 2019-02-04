// Polyfills
require('es6-promise').polyfill();
require('@babel/polyfill');

import axios, { AxiosError, AxiosResponse } from 'axios';

import { IGlobalOptions } from './index';
// import { BlockModel } from './models/block';
// import { TxModel } from './models/tx';

/*
 * TM RPC class and interfaces
 */
// export interface ISearchByQuery {
//   perPage: number;
//   page: number;
//   prove: boolean;
//   query: string;
// }

export interface IAbciInfo {
	data: any;
	version: string;
	app_version: string;
}

interface IVoteSet {
	round: string;
	prevotes: string[];
	prevotes_bit_array: string;
	precommits: string[];
	precommits_bit_array: string;
}

export interface IConsensusState {
	'height/round/step': string;
	start_time: string;
	proposal_block_hash: string;
	locked_block_hash: string;
	valid_block_hash: string;
	height_vote_set: IVoteSet[];
}

export class RpcClient {
  private options: IGlobalOptions;

  constructor(options: IGlobalOptions) {
    this.options = options;
  }

  public async abciInfo(): IAbciInfo {
    try {
      const res: AxiosResponse =
        await axios.get(`${this.options.node_rpc}/abci_info`);

      if (res.status === 200) {
	      return res.data.result.response;
      }
    } catch (error) {
      this.logError(error);
    }
  }

  public async consensusState(): IConsensusState {
    try {
      const res: AxiosResponse =
        await axios.get(`${this.options.node_rpc}/consensus_state`);

      if (res.status === 200) {
	      return res.data.result.round_state;
      }
    } catch (error) {
	    this.logError(error);
    }
  }

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
