/* global describe it */
import sync from 'meteor-sync-eventemitter';
import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';

describe('Meteor.Streamer', () => {
  it('should be decorated', () => {
    @sync({
      collectionName: 'syncedstream',
      emitFn: '_emit',
      setIndex: true,
    })
    class SyncedStream extends Meteor.Streamer {
      constructor() {
        super('test');
      }
    }
    const eventEmitter = new SyncedStream();
  });
});
