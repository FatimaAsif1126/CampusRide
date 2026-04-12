import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateRide = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    departureTime: '',
    availableSeats: 1,
    pricePerSeat: 0,
    vehicleId: 1
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/rides', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Ride created successfully!');
      navigate('/my-rides');
    } catch (error) {
      alert('Error creating ride');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a New Ride</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="source" placeholder="Source" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="destination" placeholder="Destination" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="datetime-local" name="departureTime" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="availableSeats" placeholder="Available Seats" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="pricePerSeat" placeholder="Price per Seat" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="vehicleId" placeholder="Vehicle ID" onChange={handleChange} className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Create Ride</button>
      </form>
    </div>
  );
};

export default CreateRide;