import React from 'react';
import './App.css';
import AuthPage from '../src/components/layouts/auth/AuthPage';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './components/layouts/home/HomePage';
import { QueryClient, QueryClientProvider } from 'react-query';
// import { ReactQueryDevtools } from 'react-query/devtools';
import NewPost from './components/layouts/home/newPost/NewPost';

const ONE_HOUR = 60 * 60 * 1000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: ONE_HOUR,
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Navigate to="/newfeed" />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/newpost" element={<NewPost />} />
          <Route path="/newfeed" element={<HomePage />} />
        </Routes>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
