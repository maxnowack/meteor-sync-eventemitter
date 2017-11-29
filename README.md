  # meteor-sync-eventemitter
Allows syncing event emitter events over multiple meteor servers.

## Installation
````es6
  npm install meteor-sync-eventemitter
````

## Usage

### Normal EventEmitters
````es6
  import sync from 'meteor-sync-eventemitter';
  import EventEmitter from 'events';

  @sync({
    collectionName: 'syncedeventemitter', // the collection can only be used for one event emitter.
    emitFn: 'emit', // [optional] if the emit function of the event emitter differs from the default one.
    setIndex: true, // [optional] per default, we create a expiring index to delete entries after 60 seconds.
  })
  class SyncedEventEmitter extends EventEmitter {
    // …
  }

  const eventEmitter = new SyncedEventEmitter();
  eventEmitter.emit('hello');
  eventEmitter.on('hello', () => console.log('world')); // would be triggered on all servers
````

### rocketchat:streamer
````es6
  import { Meteor } from 'meteor/meteor';
  import sync from 'meteor-sync-eventemitter';

  @sync({ collectionName: 'stream', emitFn: '_emit' })
  class SyncedStream extends Meteor.Streamer {
    constructor() {
      super('streamname');
      this.allowRead( … );
      this.allowWrite( … );
    }
  }

  const stream = new SyncedStream()
  stream.emit( … );
  stream.on( … );
````

## License
Licensed under MIT license. Copyright (c) 2017 Max Nowack

## Contributions
Contributions are welcome. Please open issues and/or file Pull Requests.

## Maintainers
- Max Nowack ([maxnowack](https://github.com/maxnowack))
