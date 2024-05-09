import { FC, useContext, useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import NotFound from './components/NotFound/NotFound';
import { LoginContext } from './components/LoginContext';
import Footer from './components/Footer';
import Header from './components/Header';
import GuardedRoute from './components/GuardedRoute';
import CreateEditNote from './components/CreateEditNote';

const Layout: FC = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <GuardedRoute />,
        children: [
          {
            path: '',
            element: <Home />
          }
        ]
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/create-note',
        element: <GuardedRoute />,
        children: [
          {
            path: '',
            element: <CreateEditNote />
          }
        ]
      },
      {
        path: '/edit/:noteId',
        element: <GuardedRoute />,
        children: [
          {
            path: '',
            element: <CreateEditNote />
          }
        ]
      },
    ],
  },
]);

const App: FC = () => {
  const { loginUser } = useContext(LoginContext);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      loginUser(storedToken);
    }
  }, [loginUser]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
