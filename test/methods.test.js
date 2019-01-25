import TendermintJS from '../lib/tendermint.js';

// Init Tendermint-Client instance
const tm = new TendermintJS({
	node_rpc: 'http://localhost:26657',
	node_ws: 'ws://localhost:26657'
});

/*
 * Test all endpoints
 */
test('/abci_info', () => {

});

test('/consensus_state', () => {

});

test('/dump_consensus_state', () => {

});

test('/genesis', () => {

});

test('/health', () => {

});

test('/net_info', () => {

});

test('/num_uncofirmed_txs', () => {

});

test('/status', () => {

});

// With query params
test('/abci_query?height=N&path=X&data=X&prove=X', () => {

});

test('/block?height=N', () => {

});

test('/blockchain?min=N&max=N', () => {

});

test('/broadcast_tx_async?tx=0x0001', () => {

});

test('/broadcast_tx_sync?tx=0x0001', () => {

});

test('/broadcast_tx_commit?tx=0x0001', () => {

});

test('/commit?height=N', () => {

});

test('/consensus_params?height=N', () => {

});

test('/subscribe?query=N', () => {

});

test('/tx?hash=N&prove=N', () => {

});

test('/tx_search?query=X&prove=X&page=X&per_page=X', () => {

});

test('/unconfirmed_txs?limit=N', () => {

});

test('/unsubscribe?query=N', () => {

});

test('/unsubscribe_all', () => {

});

test('/validators?height', () => {

});