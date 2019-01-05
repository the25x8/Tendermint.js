import { TendermintClient } from '../lib/index';

test('Import lib as ES6 module', () => {
	const instance = new TendermintClient();
	expect(instance.test()).toEqual('ok');
})