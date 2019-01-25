import '@babel/polyfill';
import { IStatus } from './interfaces/status';
import { RpcClient } from './rpcClient';
import { SocketClient } from './socketClient';

export interface IClientOptions {
  node_rpc: string;
  node_ws: string;
  logs: boolean;
}

/*
 * This is abstract wrapper
 * for RpcClient and SocketClient
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

  public test() {
    return 'ok';
  }
}
