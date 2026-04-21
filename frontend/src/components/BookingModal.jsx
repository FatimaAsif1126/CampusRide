import React, { useState } from 'react';

const BookingModal = ({ ride, isOpen, onClose, token }) => {
    const [seatsToBook, setSeatsToBook] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleBook = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/bookings', {
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

            if (!response.ok) throw new Error(data.message || 'Failed to book ride');

            alert(`Success! Total Fare: Rs. ${data.totalFare}`);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Book Ride to {ride.Destination}</h2>

                <div className="mb-4">
                    <p><strong>Available Seats:</strong> {ride.AvailableSeats}</p>
                    <p><strong>Price per Seat:</strong> Rs. {ride.PricePerSeat}</p>
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Seats to Book:</label>
                    <input
                        type="number"
                        min="1"
                        max={ride.AvailableSeats}
                        value={seatsToBook}
                        onChange={(e) => setSeatsToBook(parseInt(e.target.value))}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div className="mb-6 font-semibold text-lg text-blue-600">
                    Total Estimated: Rs. {ride.PricePerSeat * seatsToBook}
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                    <button
                        onClick={handleBook}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-300"
                    >
                        {loading ? 'Booking...' : 'Confirm Booking'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;