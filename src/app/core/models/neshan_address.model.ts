export interface NeshanConverterAddress {
  city: string;
  formatted_address: string;
  in_odd_even_zone: string;
  in_traffic_zone: string;
  municipality_zone: string;
  neighbourhood: string;
  route_name: string;
  route_type: string;
  state: string;
  status: string;
}

export interface NeshanAddress {
  address: string;
  category: string;
  location:
    {
      x: number;
      y: number;
      z: string;
    };
  neighbourhood: string;
  region: string;
  title: string;
  type: string;
}

export interface SearchedAddress {
  count: number;
  items: Array<NeshanAddress>;
}
