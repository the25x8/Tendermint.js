// Polyfills
import IValidator, { IValidators, IValidatorVote } from './interfaces/validator';

require('es6-promise').polyfill();
require('@babel/polyfill');

import axios, { AxiosError, AxiosResponse } from 'axios';

import { IGlobalOptions } from './index';
// import { BlockModel } from './models/block';
// import { TxModel } from './models/tx';

export interface IAbciInfo {
  data: any;
  version: string;
  app_version: string;
}

export interface IConsensusState {
  'height/round/step': string;
  start_time: string;
  proposal_block_hash: string;
  locked_block_hash: string;
  valid_block_hash: string;
  height_vote_set: IValidatorVote[];
}

export interface IDumpConsensusState {
  height: string;
  round: string;
  step: number;
  start_time: string;
  commit_time: string;
  validators: IValidators;
  proposal: any;
  proposal_block: any;
  proposal_block_parts: any;
  locked_round: string;
  locked_block: any;
  locked_block_parts: any;
  valid_round: string;
  valid_block: any;
  valid_block_parts: any;
  votes: IValidatorVote[];
  commit_round: string;
  last_commit: {
    votes: string[];
    votes_bit_array: string;
    peer_maj_23s: any;
  };
  last_validators: IValidators;
  peers: string[];
}

// end of interfaces
// -----------------

// Rpc client class
export class RpcClient {
  private options: IGlobalOptions;

  constructor(options: IGlobalOptions) {
    this.options = options;
  }

  // ----------------------
  // Wrappers of RPC methods
  public async abciInfo(): IAbciInfo {
    const { response } = await this.get('abci_info');
    return response;
  }

  public async consensusState(): IConsensusState {
    const { round_state } = await this.get('consensus_state');
    return round_state;
  }

  public async dumpConsensusState(): IDumpConsensusState {
    const { round_state } = await this.get('dump_consensus_state');
    return round_state;
  }

  // ----------------------
  // Universal get wrapper
  private async get(method: string): object {
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
