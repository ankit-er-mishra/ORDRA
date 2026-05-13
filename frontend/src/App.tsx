import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Landing } from './pages/Landing';
import { OrderPage } from './pages/OrderPage';
import { Demo } from './pages/Demo';
import { EmbedPage } from './pages/EmbedPage';
import { useAppStore } from './lib/store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 2,
    },
  },
});

function AppContent() {
  const { darkMode } = useAppStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-surface dark:bg-surface-dark text-text dark:text-text-dark transition-colors duration-300">
        <Routes>
          {/* Embed route — no navbar/footer */}
          <Route path="/embed/:orderId" element={<EmbedPage />} />

          {/* Regular routes with navbar/footer */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <main className="min-h-[calc(100vh-8rem)]">
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/demo" element={<Demo />} />
                    <Route path="/order/:orderId" element={<OrderPage />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
