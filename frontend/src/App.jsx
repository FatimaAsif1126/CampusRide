import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Welcome from './pages/welcome';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import ProtectedRoute from './components/ProtectedRoutes';
import Profile from './pages/profile';
import MyBookings from './pages/MyBookings';

// YOUR imports (Aliza - Ride Management)
import CreateRide from './pages/CreateRide';
import MyRides from './pages/MyRides';
import EditRide from './pages/EditRide';

const router = createBrowserRouter([
  // Fatima's routes (Authentication & Bookings)
  {
    path: "/",
    element: <Welcome />
  },
  {
    path: "/signup",
    element: <Signup />
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
  },
  
  // YOUR routes (Aliza - Ride Management)
  {
    path: "/create-ride",
    element: (
      <ProtectedRoute>
        <CreateRide />
      </ProtectedRoute>
    )
  },
  {
    path: "/my-rides",
    element: (
      <ProtectedRoute>
        <MyRides />
      </ProtectedRoute>
    )
  },
  {
    path: "/edit-ride/:id",
    element: (
      <ProtectedRoute>
        <EditRide />
      </ProtectedRoute>
    )
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;