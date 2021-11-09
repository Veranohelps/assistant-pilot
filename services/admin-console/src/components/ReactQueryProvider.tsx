import { HTTPError } from 'ky';
import React from 'react';
import {
  DefaultOptions,
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { IBaseResponse } from '../types/request';

interface TProps {
  children: React.ReactNode;
  client?: QueryClient;
}

interface IQueryClientConfig {
  queryCache?: QueryCache;
  mutationCache?: MutationCache;
  defaultOptions?: DefaultOptions;
}

const showAlert = (message: string) => {
  return new Promise<true>((res) => {
    alert(message);

    res(true);
  });
};

export const queryClientConfig: IQueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 3,
      refetchOnWindowFocus: true,
      keepPreviousData: true,
      retry: (count) => {
        if (count > 3) return false;

        return false;
      },
      onError: (err) => {
        if (err instanceof HTTPError) {
          if (err.response.status === 401) return;

          err.response.json().then((res) => {
            showAlert(
              (res as IBaseResponse).message ??
                'Sorry we encountered an issue completing your request '
            );
          });
        }
      },
    },
    mutations: {
      onError: (err) => {
        if (err instanceof HTTPError) {
          if (err.response.status === 401) return;

          err.response
            .json()
            .then((res) =>
              alert(
                (res as IBaseResponse).message ??
                  'Sorry we encountered an issue completing your request '
              )
            );
        }
      },
    },
  },
};

const queryClient = new QueryClient(queryClientConfig);

const ReactQueryProvider = (props: TProps) => {
  return (
    <QueryClientProvider client={props.client ?? queryClient}>
      {props.children}
      {process.env.NODE_ENV !== 'test' && (
        <ReactQueryDevtools panelProps={{ style: { position: 'fixed' } }} />
      )}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
