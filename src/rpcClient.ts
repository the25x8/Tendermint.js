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

export class RpcClient {
  private options: IGlobalOptions;

  constructor(options: IGlobalOptions) {
    this.options = options;
  }
}
