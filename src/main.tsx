import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from 'src/App'
import { BrowserRouter as Router } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { AppContextProvider } from './context/AppContext'
import ErrorBoundary from './components/ErrorBoundary'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
})
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppContextProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </AppContextProvider>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Router>
  </React.StrictMode>
)
