import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EAppEvents, emitter } from '../utils/eventEmitter';
import localStorage from '../utils/localStorage';

const usePersistedState = <T>(
  storeKey: string,
  key: string,
  initialState: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const initialStateRef = useRef(initialState);
  const store = useMemo(() => {
    return localStorage({ name: storeKey });
  }, [storeKey]);
  const [state, setState] = useState<T>(initialState);

  const setPersistedState: React.Dispatch<React.SetStateAction<T>> = useCallback(
    (arg) => {
      let nxtState: T | null = null;

      if (typeof arg === 'function') {
        nxtState = (arg as (prevState: T) => T)(state);
      } else {
        nxtState = arg;
      }

      store.setItem(key, nxtState);
    },
    [key, store, state]
  );

  useEffect(() => {
    store.getItem<T>(key).then((value) => {
      if (value) setState(value);
      else setPersistedState(initialStateRef.current);
    });
  }, [key, setPersistedState, store]);

  useEffect(() => {
    const unsubscribe = emitter.on(EAppEvents.CHANGE_LOCAL_STORAGE, () => {
      store.getItem<T>(key).then((value) => {
        setState(value as T);
      });
    });

    return unsubscribe;
  }, [key, store]);

  useEffect(() => {
    initialStateRef.current = initialState;
  }, [initialState]);

  return [state, setPersistedState];
};

export default usePersistedState;
