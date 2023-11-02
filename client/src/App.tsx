import React from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import DefaultLayout from './components/defaultLayout/DefaultLayout';
import { publicRoutes } from './routes';
import AdminLayout from './components/admin/adminLayout/AdminLayout';
// import { ReactQueryDevtools } from 'react-query/devtools';

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
          <Route path="/" element={<Navigate to="/home" />} />
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let AdLayout = AdminLayout;
            let Layout = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              return <Route key={index} path={route.path} element={<Page />} />;
            }
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  route.isAdmin ? (
                    <AdLayout>
                      <Page />
                    </AdLayout>
                  ) : (
                    <Layout>
                      <Page />
                    </Layout>
                  )
                }
              />
            );
          })}
        </Routes>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
