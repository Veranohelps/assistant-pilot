export interface IGeocodeAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface IGeocodeViewport {
  northeast: {
    lat: number;
    lng: number;
  };
  southwest: {
    lat: number;
    lng: number;
  };
}

export interface IGeocodeResult {
  address_components: IGeocodeAddressComponent[];
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    location_type: string;
    viewport: IGeocodeViewport;
  };
  place_id: string;
  plus_code: {
    compound_code: string;
    global_code: string;
  };
  types: string[];
}

export interface IGoogleGeocodeResponse {
  results: IGeocodeResult[];
  status: string;
}
