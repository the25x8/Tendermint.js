const TendermintJS = require('../lib/tendermint.js');

const eventBus = TendermintJS.eventBus();

test('EventBus method: on', () => {
  const onData = 'on-data';
  eventBus.on('on', data => {
    console.log('event: on, data: ', data);
    expect(data === onData).toEqual(true);
  });
  eventBus.emit('on', onData);
  eventBus.emit('on', onData);
  eventBus.emit('on', onData);
  eventBus.emit('on', onData);
});


test('EventBus method: once', () => {
  const onceData = 'once-data';
  let onceHandlerCalls = 0;
  eventBus.once('once', data => {
    onceHandlerCalls += 1;
    console.log('event: once, data: ', data);
  });

  eventBus.emit('once', onceData);
  eventBus.emit('once', onceData);
  eventBus.emit('once', onceData);

  console.log('Once handler calls: ', onceHandlerCalls);
  expect(onceHandlerCalls).toEqual(1);
});


//
test('EventBus method: off', () => {
  let offHandlerCalls = 0;
  eventBus.on('off', _ => {
    offHandlerCalls += 1;
    console.log('event off called');
  });
  eventBus.emit('off', null);
  eventBus.off('off');
  eventBus.emit('off', null);

  console.log('Off handler calls: ', offHandlerCalls);
  expect(offHandlerCalls).toEqual(1);
});
