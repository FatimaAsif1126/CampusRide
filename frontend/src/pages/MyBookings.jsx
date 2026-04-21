import React, { useState, useEffect } from 'react';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    const fetchBookings = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/bookings/my', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            console.log('Bookings response:', data); // debug

            if (!response.ok) {
                console.error('Bookings fetch failed:', data);
                setBookings([]);
                return;
            }

            // ✅ API returns { success: true, data: [...] }
            setBookings(Array.isArray(data.data) ? data.data : []);
        } catch (error) {
            console.error("Error:", error);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        try {
            // ✅ Fixed: added full URL
            const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {
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

    const statusColor = (status) => {
        if (status === 'Confirmed') return { color: '#a78bfa' };
        if (status === 'Cancelled') return { color: '#f87171' };
        return { color: '#a1a1aa' };
    };

    if (loading) return (
        <div style={{
            minHeight: '100vh', background: '#0e0c15',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Sora', sans-serif", color: '#a78bfa'
        }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');`}</style>
            Loading…
        </div>
    );

    return (
        <div style={{
            minHeight: '100vh', background: '#0e0c15',
            fontFamily: "'Sora', sans-serif", padding: '48px 24px',
            position: 'relative', overflow: 'hidden'
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
                .booking-card { transition: border-color 0.2s; }
                .booking-card:hover { border-color: rgba(139,92,246,0.4) !important; }
                .cancel-btn { transition: background 0.2s; }
                .cancel-btn:hover { background: rgba(239,68,68,0.2) !important; }
            `}</style>

            <div style={{
                position: 'absolute', width: 400, height: 400, borderRadius: '50%',
                top: -80, left: -80, background: 'rgba(124,58,237,0.08)',
                filter: 'blur(60px)', pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute', width: 280, height: 280, borderRadius: '50%',
                bottom: 40, right: -60, background: 'rgba(167,139,250,0.07)',
                filter: 'blur(60px)', pointerEvents: 'none'
            }} />

            <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative' }}>

                <div style={{ marginBottom: 32 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '4px 14px', borderRadius: 999,
                        background: 'rgba(109,40,217,0.15)',
                        border: '1px solid rgba(139,92,246,0.3)',
                        fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
                        color: '#a78bfa', marginBottom: 16
                    }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa' }} />
                        CAMPUSRIDE
                    </div>
                    <h1 style={{
                        fontSize: 36, fontWeight: 700, color: '#fff',
                        letterSpacing: '-1.2px', margin: 0, lineHeight: 1.2
                    }}>
                        My <span style={{ color: '#a78bfa' }}>Bookings</span>
                    </h1>
                </div>

                {bookings.length === 0 ? (
                    <div style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 20, padding: '48px 32px',
                        textAlign: 'center', color: '#52525b', fontSize: 14, fontWeight: 300
                    }}>
                        No bookings yet.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {bookings.map((b) => (
                            <div
                                key={b.BookingID}
                                className="booking-card"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    backdropFilter: 'blur(16px)', borderRadius: 20,
                                    padding: '24px 28px', display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start', gap: 16
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <h3 style={{
                                        fontSize: 17, fontWeight: 600, color: '#ede9fe',
                                        margin: '0 0 6px', letterSpacing: '-0.3px'
                                    }}>
                                        {b.Source} → {b.Destination}
                                    </h3>
                                    <p style={{
                                        fontSize: 12, color: '#52525b',
                                        fontWeight: 300, margin: '0 0 16px'
                                    }}>
                                        {new Date(b.BookingTime).toLocaleString()}
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
                                        {[
                                            ['Driver', b.DriverName],
                                            ['Seats', b.SeatsBooked],
                                            ['Fare', `Rs. ${b.TotalFare}`],
                                        ].map(([label, value]) => (
                                            <div key={label}>
                                                <span style={{ fontSize: 11, color: '#52525b', fontWeight: 400, letterSpacing: '0.05em' }}>
                                                    {label}
                                                </span>
                                                <div style={{ fontSize: 13, color: '#d4d4d8', fontWeight: 500, marginTop: 2 }}>
                                                    {value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, flexShrink: 0 }}>
                                    <span style={{
                                        fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
                                        padding: '4px 12px', borderRadius: 999,
                                        background: 'rgba(139,92,246,0.12)',
                                        border: '1px solid rgba(139,92,246,0.25)',
                                        ...statusColor(b.BookingStatus)
                                    }}>
                                        {b.BookingStatus.toUpperCase()}
                                    </span>

                                    {b.BookingStatus === 'Confirmed' && b.RideStatus === 'Active' && (
                                        <button
                                            className="cancel-btn"
                                            onClick={() => handleCancel(b.BookingID)}
                                            style={{
                                                padding: '8px 16px', borderRadius: 10,
                                                background: 'rgba(239,68,68,0.1)',
                                                border: '1px solid rgba(239,68,68,0.3)',
                                                color: '#f87171', fontSize: 12, fontWeight: 500,
                                                cursor: 'pointer', fontFamily: "'Sora', sans-serif"
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;