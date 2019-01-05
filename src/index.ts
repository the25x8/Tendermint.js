import { decode } from 'msgpack-lite'

export class TxModel {
	height: number;
	hash: string;
	result: {
		tags: any[]
	};
	tx: any;
	kvs: object; // Tx key value store

	constructor(rawTx) {
		this.height = rawTx.tx.height;
		this.hash = rawTx.tx.hash;
		this.result = rawTx.tx.result;
		this.tx = decode(Buffer.from(rawTx.tx, 'base64'));

		// Decoding result key-values
		if (this.result && this.result.tags) {
			this.kvs = this.result.tags.reduce((memo, group) => {
				memo[atob(group.key)] = group.value ? atob(group.value) : null;
				return memo;
			}, {});
		}
	}

	isValid() {
		return this.hash && this.height;
	}
}

export class BlockModel {
	txs: TxModel[];
	hash: string;
	height: number;
	num_txs: number;
	total_txs: number;
	time: string;
	chain: string;
	latest_block: {
		hash: string;
		height: number;
	};

	constructor(rawBlock) {
		const { block, block_meta, block_id, header } = rawBlock;

		// Meta info
		this.hash = block_id ? block_id.hash : (block_meta ? block_meta.block_id.hash : null);
		this.height = header ? header.height : block.header.height;
		this.num_txs = header ? header.num_txs : block.header.num_txs;
		this.total_txs = header ? header.total_txs : block.header.total_txs;
		this.time = header ? header.time : block.header.time;
		this.chain = header ? header.chain_id : block.header.chain_id;
		this.latest_block = {
			hash: header ? header.last_block_id.hash : block.header.last_block_id.hash,
			height: this.height
		};

		// Block transactions
		if (block && block.data && block.data.txs) {
			this.txs = block.data.txs.map(rawTx => new TxModel(rawTx));
		}
	}
}

export class TendermintClient {
	constructor() {}

	test() {
		new BlockModel({ test: 'test' });
		new TxModel({ test: 'test' });
		return 'ok';
	}

}