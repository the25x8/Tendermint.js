const TendermintJS = require('../lib/tendermint.js');

test('Require lib as commonjs module', () => {
	const instance = new TendermintJS();
	expect(instance.test()).toEqual('ok');
})