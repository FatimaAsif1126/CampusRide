import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingModal = ({ ride, isOpen, onClose }) => {
    const navigate = useNavigate();  // ✅ MOVED INSIDE component
    const [seatsToBook, setSeatsToBook] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen || !ride) return null;

    const handleBook = async () => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');

        if (!token) {
            setError('You are not logged in. Please log in first.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    rideId: ride.RideID,
                    seatsToBook: seatsToBook
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                onClose();
                navigate('/payment', {
                    state: {
                        bookingId: data.bookingId,
                        totalFare: data.totalFare,
                        source: ride.Source,
                        destination: ride.Destination
                    }
                });
            } else {
                setError(data.message || 'Failed to book ride');
            }
        } catch (err) {
            setError('Failed to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Book Ride</h2>
                <p className="text-gray-500 mb-6">
                    {ride.Source} → {ride.Destination}
                </p>

                <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Driver</span>
                        <span className="font-medium">{ride.DriverName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Available Seats</span>
                        <span className="font-medium">{ride.AvailableSeats}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Price per Seat</span>
                        <span className="font-medium">Rs. {ride.PricePerSeat}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Seats to Book</label>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSeatsToBook(prev => Math.max(1, prev - 1))}
                            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-xl font-bold flex items-center justify-center"
                        >
                            −
                        </button>
                        <span className="text-2xl font-bold w-8 text-center text-purple-600">{seatsToBook}</span>
                        <button
                            onClick={() => setSeatsToBook(prev => Math.min(ride.AvailableSeats, prev + 1))}
                            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-xl font-bold flex items-center justify-center"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6 p-4 bg-purple-50 rounded-xl">
                    <span className="text-gray-600 font-medium">Total Estimated</span>
                    <span className="text-2xl font-bold text-purple-600">
                        Rs. {ride.PricePerSeat * seatsToBook}
                    </span>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleBook}
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold transition-colors"
                    >
                        {loading ? 'Booking...' : 'Confirm Booking'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;