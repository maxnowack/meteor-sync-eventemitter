import { getGlobal } from 'meteor-globals';

const Meteor = getGlobal('meteor', 'Meteor');

/**
 * Save a event
 * @callback insertFunction
 * @param {Any[]} args - Original event arguments
 * @return  {Promise} returns a promise which resolves a unique id of the saved event
 */

/**
 * remove a event
 * @callback removeFunction
 * @param {Any} id - Unique id of the event
 */

/**
 * callback function which gets called if a event was inserted
 * @callback onInsertCallback
 * @param {Any} id - Unique id of the event
 * @param {Any[]} args - Original event arguments
 */

/**
 * triggers a callback if a event gets inserted
 * @callback onInsertFunction
 * @param {onInsertCallback} callback - callback to trigger
 */

/**
 * ES7 decorator for classes which are implementing a eventemitter interface,
   to sync events over multiple server instances.
 * @param {Object} syncer - interface which describes how to sync the events
 * @param {insertFunction} syncer.insert - function that saves a event
 * @param {removeFunction} syncer.remove - function that removes a event
 * @param {onInsertFunction} syncer.onInsert - function triggers a callback if a event gets inserted
 * @param {String} [emitFn=emit] - Name of the function that emits the events
 * @return {Class} decorated class
 */
export default function syncEventEmitter(syncer, emitFn = 'emit') {
  return function decorator(EV) {
    if (Meteor.isClient) return EV;
    return class SyncedEventEmitter extends EV {
      constructor(...constructorArgs) {
        super(...constructorArgs);
        this.syncedIds = [];

        syncer.onInsert((id, args) => {
          if (this.syncedIds.indexOf(id) > -1) {
            // delete if event is from current instance
            this.syncedIds = this.syncedIds.filter(item => item !== id);
            return;
          }

          // emit the event if it comes from another instance
          super[emitFn](...args);
        });
      }
      [emitFn](...args) {
        // save the event
        syncer.insert(args).then((id) => {
          this.syncedIds.push(id);
          // emit the original event
          super[emitFn](...args);
        });
      }
    };
  };
}
