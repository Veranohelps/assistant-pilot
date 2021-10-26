import Emittery from 'emittery';

export const emitter = new Emittery();

export enum EAppEvents {
  CHANGE_LOCAL_STORAGE = 'CHANGE_LOCAL_STORAGE',
}
