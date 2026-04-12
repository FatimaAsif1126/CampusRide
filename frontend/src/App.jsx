import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateRide from './pages/CreateRide';
import MyRides from './pages/MyRides';
import EditRide from './pages/EditRide';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="bg-blue-500 text-white p-10 text-center">
            <h1 className="text-4xl font-bold">CampusRide</h1>
            <p className="mt-4">Tailwind is working!</p>
          </div>
        } />
        <Route path="/create-ride" element={<CreateRide />} />
        <Route path="/my-rides" element={<MyRides />} />
        <Route path="/edit-ride/:id" element={<EditRide />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;