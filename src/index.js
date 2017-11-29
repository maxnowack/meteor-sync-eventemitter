import mongoSync from './mongoSync';
import syncEventEmitter from './syncEventEmitter';

export { default as mongoSync } from './mongoSync';
export { default as syncEventEmitter } from './syncEventEmitter';
export default (options = {}) => {
  if (!options.collectionName) throw new Error('parameter "collectionName" is required!');
  return syncEventEmitter(mongoSync(options.collectionName, options.setIndex), options.emitFn);
};
