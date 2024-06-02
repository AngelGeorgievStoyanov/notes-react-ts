import { FC, useContext } from 'react';
import { LoaderFunctionArgs, RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';
import { LoginContext, LoginContextType } from './components/LoginContext';
import NotFound from './components/NotFound/NotFound';
import GuardedRoute from './components/GuardedRoute';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import CreateEditNote from './components/CreateEditNote';
import NotesAsTable from './components/NotesAsTable';
import { getNoteById } from './services/noteService';


const noteLoaderById = (context: LoginContextType) => async ({ params }: LoaderFunctionArgs) => {
  const accessToken = context.token || localStorage.getItem('accessToken');
  if (params.noteId && accessToken) {
    return await getNoteById(params.noteId, accessToken);
  } else {
    throw new Error(`Invalid or missing note ID`);
  }
};


const AppRoot: FC = () => {
  const loginContext = useContext(LoginContext);

  const router = createBrowserRouter([
    {
      element: <App />,
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
              loader: noteLoaderById(loginContext),
              element: <CreateEditNote />
            }
          ]
        },
        {
          path: '/notes-table',
          element: <GuardedRoute />,
          children: [
            {
              path: '',
              element: <NotesAsTable />
            }
          ]
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoot;
