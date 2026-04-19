import React, { useState, useEffect } from 'react';

const MyBookings = ({ token }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const response = await fetch('/api/bookings/my', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        try {
            const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                fetchBookings();
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to cancel');
            }
        } catch (error) {
            console.error("Cancellation error:", error);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
            {bookings.length === 0 ? <p>No bookings yet.</p> : (
                <div className="space-y-4">
                    {bookings.map((b) => (
                        <div key={b.BookingID} className="border rounded-lg p-4 flex justify-between shadow-sm">
                            <div>
                                <h3 className="font-semibold text-lg">{b.Source} ➔ {b.Destination}</h3>
                                <p className="text-gray-600 text-sm mb-2">{new Date(b.BookingTime).toLocaleString()}</p>
                                <p><strong>Driver:</strong> {b.DriverName}</p>
                                <p><strong>Seats Booked:</strong> {b.SeatsBooked}</p>
                                <p><strong>Total Fare:</strong> Rs. {b.TotalFare}</p>
                                <p>Status: <span className="font-bold">{b.BookingStatus}</span></p>
                            </div>

                            {b.BookingStatus === 'Confirmed' && b.RideStatus === 'Active' && (
                                <button
                                    onClick={() => handleCancel(b.BookingID)}
                                    className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 h-fit"
                                >
                                    Cancel Booking
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;