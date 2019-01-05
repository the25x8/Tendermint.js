import { decode } from 'msgpack-lite'

/*
 * Block interfaces
 */
export interface IBlockID {
	hash: string;
	parts: {
		hash: string;
		total: string;
	}
}

export interface IBlockPrecommit {
	type: string;
	round: string;
	height: string;
	validator_index: string;
	validator_address: string;
	signature: {
		data: string;
		type: string;
	},
	block_id: IBlockID
}

export interface IBlockLastCommit {
	precommits: IBlockPrecommit[];
	blockID: IBlockID;
}

export interface IBlockData {
	txs: string[];
}

export interface IBlockHeader {
	app_hash: string;
	chain_id: string;
	height: string;
	time: string;
	num_txs: string;
	last_block_id: IBlockID,
	last_commit_hash: string;
	data_hash: string;
	validators_hash: string;
}

export interface IBlockMeta {
	header: IBlockHeader;
	block_id: IBlockID;
}

export interface IBlock {
	last_commit: IBlockLastCommit;
	data: IBlockData;
	header: IBlockHeader;
	block_meta: IBlockMeta;
}

/*
 * -------------------
 * Transaction interfaces
 */
export interface ITxProof {
	Data: string;
	RootHash: string;
	Total: string;
	Index: string;
	Proof: {
		aunts: string[]
	};
}

export interface ITx {
	proof: ITxProof;
	index: string;
	height: string;
	hash: string;
	tx: string;
	tx_result: {
		log?: string;
		data?: string;
		code?: string;
	};
}

/*
 * ----------------------
 * Common models
 */
export class BlockModel {
	constructor(rawBlock) {

	}
}

export class TxModel {
	constructor(rawTx) {

	}
}

export class TendermintClient {
	constructor() {}

	test() {
		return 'ok';
	}

}