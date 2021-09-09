import ApolloClientProvider from './components/ApolloClientProvider';
import AppThemeProvider from './components/AppThemeProvider';
import ReactQueryProvider from './components/ReactQueryProvider';
import Expedition from './views/Expedition';

function App() {
  return (
    <ReactQueryProvider>
      <ApolloClientProvider>
        <AppThemeProvider>
          <Expedition />
        </AppThemeProvider>
      </ApolloClientProvider>
    </ReactQueryProvider>
  );
}

export default App;
