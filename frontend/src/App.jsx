import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Welcome from './pages/welcome';   // lowercase w
import Signup from './pages/signup';     // lowercase s
import Dashboard from './pages/dashboard';
import ProtectedRoute from './components/ProtectedRoutes';
import Profile from './pages/profile';
import MyBookings from './pages/MyBookings';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />              // Capital W (component name)
  },
  {
    path: "/signup",
    element: <Signup />               // Capital S (component name)
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  {                                           
    path: "/my-bookings",
    element: (
      <ProtectedRoute>
        <MyBookings />
      </ProtectedRoute>
    )
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;