export interface IValidatorVote {
	round: string;
	prevotes: string[];
	prevotes_bit_array: string;
	precommits: string[];
	precommits_bit_array: string;
}

export interface IValidators {
	proposer: IValidator;
	validators: IValidator[];
}

export default interface IValidator {
	voting_power: string;
	address: string;
	accum?: string;
	pub_key: {
		type: string;
		value: string;
	};
}
