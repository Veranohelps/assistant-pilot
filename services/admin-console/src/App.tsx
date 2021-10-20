import { BrowserRouter } from 'react-router-dom';
import ApolloClientProvider from './components/ApolloClientProvider';
import AppThemeProvider from './components/AppThemeProvider';
import ReactQueryProvider from './components/ReactQueryProvider';
import AppRoutes from './routes';

function App() {
  return (
    <BrowserRouter>
      <ReactQueryProvider>
        <ApolloClientProvider>
          <AppThemeProvider>
            <AppRoutes />
          </AppThemeProvider>
        </ApolloClientProvider>
      </ReactQueryProvider>
    </BrowserRouter>
  );
}

export default App;
