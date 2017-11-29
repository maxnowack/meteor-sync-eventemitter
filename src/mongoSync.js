import { getGlobal } from 'meteor-globals';

const Meteor = getGlobal('meteor', 'Meteor');
const Mongo = getGlobal('mongo', 'Mongo');

export default function mongoSync(collectionName, setIndex = true) {
  if (Meteor.isClient) return null;
  const collection = typeof collectionName === 'string'
    ? new Mongo.Collection(collectionName)
    : collectionName;

  if (setIndex) {
    // eslint-disable-next-line no-underscore-dangle
    collection._ensureIndex({ time: 1 }, { expireAfterSeconds: 60 });
  }

  const onInsertCallbacks = [];
  collection.find().observeChanges({
    added(id, { args }) {
      onInsertCallbacks.forEach(callback => callback(id, args));
    },
  });

  return {
    insert: args => new Promise((resolve, reject) => {
      collection.insert({ args, time: new Date() }, (err, id) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(id);
      });
    }),
    remove: _id => collection.remove({ _id }),
    onInsert: callback => onInsertCallbacks.push(callback),
  };
}
