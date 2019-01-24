import '@babel/polyfill';
import { IStatus } from './interfaces/status';
import { SocketClient } from './socketClient';
import { RpcClient } from './rpcClient';

export interface IClientOptions {
	node_rpc: string;
	node_ws: string;
	logs: boolean;
}

/*
 * This is abstract wrapper
 * for RpcClient and SocketClient
 */
export class TendermintJs {
	private options: IClientOptions;

	public status: IStatus; // Last sync node status
	public socket: SocketClient;
	public rpc: RpcClient;

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
