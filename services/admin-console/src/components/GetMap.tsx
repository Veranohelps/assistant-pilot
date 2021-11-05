import { forwardRef } from 'react';
import { useMap } from 'react-leaflet';

const GetMap = forwardRef<L.Map>((props, ref) => {
  const map = useMap();

  if (ref) {
    if (typeof ref === 'function') {
      ref(map);
    } else {
      ref.current = map;
    }
  }

  return null;
});

export default GetMap;
