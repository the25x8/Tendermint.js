// import '@babel/polyfill';

// Base classes
import { RpcClient } from './rpcClient';
import { SocketClient } from './socketClient';

// Import models and interfaces
import { IBlock } from './interfaces/block';
import { ITx } from './interfaces/tx';
import { BlockModel } from './models/block';
import { TxModel } from './models/tx';

export interface IGlobalOptions {
  node_rpc: string;
  node_ws: string;
  logs: boolean;
}

/*
 * This is abstract wrapper
 * for RpcClient and SocketClient
 * provides factories of models
 */
export default class TendermintJs {

  // Static factory methods
  public static createBlockModel = (rawBlock: IBlock): BlockModel => new BlockModel(rawBlock);
  public static createTxModel = (rawTx: ITx): TxModel => new TxModel(rawTx);
  public socket: SocketClient;
  public rpc: RpcClient;

  // Global options
  private options: IGlobalOptions;

  constructor(options: IGlobalOptions) {
    this.options = options;

    // Create instances
    this.socket = new SocketClient(options);
    this.rpc = new RpcClient(options);
  }

  public test() {
    return 'ok';
  }
}
