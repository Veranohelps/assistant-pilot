import { BrowserRouter } from 'react-router-dom';
import ApolloClientProvider from './components/ApolloClientProvider';
import AppThemeProvider from './components/AppThemeProvider';
import AuthProvider from './components/AuthProvider';
import ReactQueryProvider from './components/ReactQueryProvider';
import AppRoutes from './routes';

function App() {
  return (
    <AuthProvider>
      <ReactQueryProvider>
        <ApolloClientProvider>
          <AppThemeProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AppThemeProvider>
        </ApolloClientProvider>
      </ReactQueryProvider>
    </AuthProvider>
  );
}

export default App;
