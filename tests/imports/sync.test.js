/* global describe it */
import sync from 'meteor-sync-eventemitter';
import { Meteor } from 'meteor/meteor';
import EventEmitter from 'events';
import { chai } from 'meteor/practicalmeteor:chai';

describe('syncEventEmitter', () => {
  it('should be synced', (done) => {
    const SyncedEventEmitter = sync({
      collectionName: 'syncedeventemitter',
      emitFn: 'emit',
      setIndex: true,
    })(EventEmitter);
    if (Meteor.isClient) {
      done();
      return;
    }

    const eventEmitter = new SyncedEventEmitter();
    eventEmitter.emit('hello', 'test');
    eventEmitter.on('hello', (test) => {
      chai.assert.equal('test', test);
      done();
    });
  });
});
