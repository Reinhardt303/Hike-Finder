import Home from "./Home";
import Hikes from './Hikes';
import HikeDetails from "./HikeDetails";
import App from './App';
import Login from './Login';
import About from './About';
import Signup from './Signup';
import ProtectedRoutes from "./ProtectedRoutes";

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'hikes',
        element: (
          <ProtectedRoutes>
            <Hikes />
          </ProtectedRoutes>
        ),
      },
      {
        path: 'hikes/:id',
        element: (
          <ProtectedRoutes>
            <HikeDetails />
          </ProtectedRoutes>
        ),
      },
      {
        path: 'signup',
        element: <Signup />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'about',
        element: <About />
      }
    ]
  }
];

export default routes;
