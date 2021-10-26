import localForage from 'localforage';
import { EAppEvents, emitter } from './eventEmitter';

const localStorage = (options: LocalForageOptions): LocalForage => {
  const instance = localForage.createInstance(options);

  const setItem: typeof localForage.setItem = async (...args) => {
    const res = await instance.setItem(...args);

    emitter.emit(EAppEvents.CHANGE_LOCAL_STORAGE);

    return res;
  };

  return {
    ...instance,
    setItem,
  };
};

export default localStorage;
