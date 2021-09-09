import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '../services/httpService';

interface TProps {
  children: React.ReactNode;
}

const ApolloClientProvider = (props: TProps) => {
  return <ApolloProvider client={apolloClient}>{props.children}</ApolloProvider>;
};

export default ApolloClientProvider;
