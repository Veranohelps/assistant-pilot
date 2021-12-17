// attach a url field to a target object on a specific path
// if path is not provided, target becomes the provided object.
// if an array is provided, each member of the array will be treated as the target.
// path can be an array or a dot path e.g. ['a', 'b', 'c'] === 'a.b.c' for target { a: { b: { c: { ... } } } }
// This function mutates the target
const withUrl = (target: any, callback: (entity: any) => string, path?: string | string[]) => {
  // if entities is an array, apply withUrl to every member of the array.
  // this assumes of course that the array is 1-dimensional, as much as this
  // can be made more sophisticated to allow for n-dimensional arrays, there's currently
  // no use for that on our app right now
  if (Array.isArray(target)) {
    target.forEach((e) => {
      withUrl(e, callback, path);
    });

    return;
  }

  // if path is available split on "."
  const pArray = path ? (Array.isArray(path) ? path : path.split('.')) : null;

  // if path is null, then we've arrived at the target key/value pair
  // we create a url field on the target object and assign to it the
  // return value of "callback"
  if (pArray === null || !pArray.length) {
    target.url = callback(target);
  } else {
    // if we are here, then we've not reached our target yet

    // first extract and remove the first element of pArray,
    // this should be the key to the next target object or Array
    const key = pArray.shift();
    // get the next target
    const nextTarget = target[key as any];

    // if the target exists, apply withUrl to it
    if (nextTarget) {
      withUrl(nextTarget, callback, pArray);
    }
  }

  return;
};

const appUrl = process.env.APP_URL;

export const appUrls = {
  personal: {
    route: {
      id: (id: string) => `${appUrl}/personal/route/${id}`,
    },
    expedition: {
      id: (id: string) => `${appUrl}/personal/expedition/${id}`,
      user: {
        log: {
          id: (id: string) => `${appUrl}/personal/expedition/user/log/${id}`,
        },
      },
    },
    waypoint: {
      id: (id: string) => `${appUrl}/personal/waypoint/${id}`,
    },
  },
  admin: {
    route: {
      id: (id: string) => `${appUrl}/admin/route/${id}`,
    },
    expedition: {
      id: (id: string) => `${appUrl}/admin/expedition/${id}`,
    },
    waypoint: {
      id: (id: string) => `${appUrl}/admin/waypoint/${id}`,
    },
  },
};

export default withUrl;
