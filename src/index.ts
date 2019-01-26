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

export interface IClientOptions {
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
  private options: IClientOptions;

  constructor(options: IClientOptions) {
    this.options = options;

    // Create instances
    this.socket = new SocketClient(options);
    this.rpc = new RpcClient(options);
  }

	public static createBlockModel(type, rawBlock: IBlock): BlockModel {
		return new BlockModel(rawBlock);
	}

	public static createTxModel(rawTx: ITx): TxModel {
    return new TxModel(rawTx);
	}

  public test() {
    return 'ok';
  }
}
