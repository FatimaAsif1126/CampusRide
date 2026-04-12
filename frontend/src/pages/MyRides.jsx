import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyRides = () => {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/rides/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRides(response.data);
    } catch (error) {
      console.error('Error fetching rides', error);
    }
  };

  const deleteRide = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/rides/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Ride deleted successfully');
      fetchRides();
    } catch (error) {
      alert('Error deleting ride');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">My Rides</h1>
      <Link to="/create-ride" className="bg-green-500 text-white p-2 rounded mb-4 inline-block">Create New Ride</Link>
      <div className="space-y-4 mt-4">
        {rides.map((ride) => (
          <div key={ride.RideID} className="border p-4 rounded shadow">
            <p><strong>From:</strong> {ride.Source} → <strong>To:</strong> {ride.Destination}</p>
            <p><strong>Departure:</strong> {ride.DepartureTime}</p>
            <p><strong>Seats:</strong> {ride.AvailableSeats} | <strong>Price:</strong> Rs.{ride.PricePerSeat}</p>
            <Link to={`/edit-ride/${ride.RideID}`} className="bg-yellow-500 text-white p-1 rounded mr-2">Edit</Link>
            <button onClick={() => deleteRide(ride.RideID)} className="bg-red-500 text-white p-1 rounded">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRides;