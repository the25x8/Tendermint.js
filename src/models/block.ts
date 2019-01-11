import {
	IBlock,
	IBlockData,
	IBlockLastCommit,
	IBlockHeader,
	IBlockMeta
} from '../interfaces/block';

export class BlockModel implements IBlock {
	last_commit: IBlockLastCommit;
	data: IBlockData;
	header: IBlockHeader;
	block_meta: IBlockMeta;

	constructor(rawBlock: IBlock) {
		this.last_commit = rawBlock.last_commit;
		this.block_meta = rawBlock.block_meta;
		this.header = rawBlock.header;
		this.data = rawBlock.data;
	}
}
