import { FC, useContext, useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import NotFound from './components/NotFound/NotFound';
import { LoginContext } from './components/LoginContext';

const Layout: FC = () => (
  <>
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
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
