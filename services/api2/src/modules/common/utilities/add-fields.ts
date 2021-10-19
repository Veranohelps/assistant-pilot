import { ensureArray } from './ensure-array';

type TFlatten<T> = T extends (infer E)[] ? E : T;
type TUnion<T, U> = T extends (infer V)[] ? (V & U)[] : T & U;

class AddFields<T> implements Pick<Promise<T>, 'then' | 'catch' | 'finally'> {
  promises: any[] = [];
  resolvers: {
    key: string;
    getFn: (entities: any) => Promise<any>;
    resolveFn?: (entity: TFlatten<T>, group: any) => any;
  }[] = [];

  constructor(private target: T) {}

  async resolve(): Promise<T> {
    if (!this.target) throw new Error('please provide a target');

    const res = await Promise.all(this.resolvers.map((r) => r.getFn(this.target)));

    ensureArray(this.target).forEach((t) => {
      const entity = t as any;

      this.resolvers.forEach((resolver, index) => {
        entity[resolver.key] = resolver.resolveFn?.(entity, res[index]) ?? res[index];
      });
    });

    return this.target;
  }

  add<K extends string, CResult, RResult = CResult>(
    key: K,
    getFn: () => Promise<CResult>,
    resolveFn?: (entity: TFlatten<T>, group: CResult) => RResult,
  ) {
    this.promises.push(getFn());
    this.resolvers.push({ key, resolveFn, getFn });

    return this as unknown as AddFields<TUnion<T, { [k in K]: RResult }>>;
  }

  then: Promise<T>['then'] = (onFulfilled, onRejected) => {
    return this.resolve().then(onFulfilled, onRejected);
  };

  catch: Promise<T>['catch'] = (onRejected) => {
    return this.resolve().catch(onRejected);
  };

  finally: Promise<T>['finally'] = (onFinally) => {
    return this.resolve().finally(onFinally);
  };

  static target<T>(target: T) {
    const addFields = new AddFields<T>(target);

    return addFields;
  }
}

export default AddFields;
