import '@babel/polyfill';
import { IStatus } from './interfaces/status';

// Base classes
import { RpcClient } from './rpcClient';
import { SocketClient } from './socketClient';

// Import models and interfaces
import { BlockModel } from './models/block';
import { IBlock } from './interfaces/block';
import { TxModel } from './models/tx';
import { ITx } from './interfaces/tx';

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
  public status: IStatus; // Last sync node status
  public socket: SocketClient;
  public rpc: RpcClient;

  // Static factory methods
	public static createBlockModel = (rawBlock: IBlock): BlockModel => new BlockModel(rawBlock);
	public static createTxModel = (rawTx: ITx): TxModel => new TxModel(rawTx);

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
