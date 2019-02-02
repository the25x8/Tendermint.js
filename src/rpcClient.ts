// Polyfills
require('es6-promise').polyfill();
require("@babel/polyfill");

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
	jsonrpc: string;
	id: string;
  result: {
    response: {
      data: any;
      version: string;
      app_version: string;
    }
  }
}

export class RpcClient {
  private options: IGlobalOptions;

  constructor(options: IGlobalOptions) {
    this.options = options;
  }

  public async abciInfo(): IAbciInfo {
    try {
	    const response: AxiosResponse = await axios.get(`${this.options.node_rpc}/abci_info`);

	    if (response.status === 200) {
		    return response.data;
	    }
    } catch (error) {
	    this.logError(error);
    }
  }

  private logError(error: AxiosError) {
	  if (this.options.logs) {
		  if (error.response) {
			  console.log(error.response.data);
			  console.log(error.response.status);
			  console.log(error.response.headers);
		  } else if (error.request) {
			  console.log(error.request);
		  } else {
			  console.log('Error', error.message);
		  }
		  console.log(error.config);
    }
  }
}
