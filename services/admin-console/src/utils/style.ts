import { nanoid } from 'nanoid';

export const className = () => {
  const store = new Map<string, string>();

  const getClassName = (name: string) => {
    let cls = store.get(name);

    if (!cls) {
      cls = `${name}-${nanoid(5)}`;

      store.set(name, cls);
    }

    return cls;
  };

  const set = (...classes: string[]) => {
    const res = classes.map((cls) => getClassName(cls));

    return res.join(' ');
  };

  const get = (name: string) => `.${getClassName(name)}`;

  return { set, get };
};

export const toEm = (...pxs: (number | string)[]) => {
  return pxs.map((px) => (typeof px === 'number' ? `${(px / 16).toFixed(2)}em` : px)).join(' ');
};

export const toRem = (...pxs: (number | string)[]) => {
  return pxs.map((px) => (typeof px === 'number' ? `${(px / 16).toFixed(2)}rem` : px)).join(' ');
};
