import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { getBpaProvidersService, getBpaReportsService, getBpaZonesService } from '../../services/bpaService';
import { IGetBpaProvidersResponse, IGetBpaReportsResponse, IGetBpaZonesResponse } from '../../types/bpa';

type TQueryOptions<T1, T2> = Omit<
  UseQueryOptions<T1, unknown, T2, string[]>,
  'queryKey' | 'queryFn'
>;

export const useBpaZonesQuery = <T2 = IGetBpaZonesResponse>(
  options?: TQueryOptions<IGetBpaZonesResponse, T2>
): UseQueryResult<T2> => {
  const query = useQuery(['bpa', 'zone'], getBpaZonesService, options);

  return query;
};

export const useBpaProvidersQuery = <T2 = IGetBpaProvidersResponse>(
  options?: TQueryOptions<IGetBpaProvidersResponse, T2>
): UseQueryResult<T2> => {
  const query = useQuery(['bpa', 'provider'], getBpaProvidersService, options);

  return query;
};

export const useBpaReportsQuery = <T2 = IGetBpaProvidersResponse>(
  options?: TQueryOptions<IGetBpaReportsResponse, T2>
): UseQueryResult<T2> => {
  const query = useQuery(['bpa', 'report'], getBpaReportsService, options);

  return query;
};
