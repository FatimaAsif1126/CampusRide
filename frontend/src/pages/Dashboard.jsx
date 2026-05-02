import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Dashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const [stats, setStats] = useState({ total: 0, confirmed: 0, cancelled: 0, spent: 0 });
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/bookings/my', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    const bookings = data.data;
                    setStats({
                        total: bookings.length,
                        confirmed: bookings.filter(b => b.BookingStatus === 'Confirmed').length,
                        cancelled: bookings.filter(b => b.BookingStatus === 'Cancelled').length,
                        spent: bookings
                            .filter(b => b.BookingStatus === 'Confirmed')
                            .reduce((sum, b) => sum + parseFloat(b.TotalFare || 0), 0)
                    });
                    setRecentBookings(bookings.slice(0, 3));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const statCards = [
        { label: 'Total Bookings', value: stats.total, color: '#a78bfa', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)' },
        { label: 'Confirmed', value: stats.confirmed, color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' },
        { label: 'Cancelled', value: stats.cancelled, color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
        { label: 'Total Spent', value: `Rs. ${stats.spent.toFixed(0)}`, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
    ];

    const quickActions = [
        { label: 'Find a Ride', desc: 'Search available rides', icon: '🔍', path: '/rides', color: '#7C3AED' },
        { label: 'My Bookings', desc: 'View booking history', icon: '📋', path: '/my-bookings', color: '#0891B2' },
        { label: 'My Wallet', desc: 'Manage your balance', icon: '👛', path: '/wallet', color: '#059669' },
        { label: 'Profile', desc: 'Update your info', icon: '👤', path: '/profile', color: '#DC2626' },
    ];

    return (
        <div className="min-h-screen bg-[#0e0c15] text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');`}</style>
            <Navbar />

            {/* Background blobs */}
            <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
                 style={{ background: 'rgba(124,58,237,0.06)', filter: 'blur(80px)', transform: 'translate(30%, -30%)' }} />
            <div className="fixed bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none"
                 style={{ background: 'rgba(167,139,250,0.05)', filter: 'blur(80px)', transform: 'translate(-30%, 30%)' }} />

            <div className="max-w-5xl mx-auto px-6 pt-12 pb-20 relative z-10">

                {/* Welcome Header */}
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest text-purple-400 bg-purple-900/20 border border-purple-700/40 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        CAMPUSRIDE
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                        Welcome back, <span className="text-purple-400">{user.name?.split(' ')[0] || 'User'}!</span>
                    </h1>
                    <p className="text-zinc-500 text-base">
                        You are logged in as <span className="text-zinc-300">{user.role || 'Passenger'}</span>
                        {user.email && <> · <span className="text-zinc-400">{user.email}</span></>}
                    </p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {statCards.map(({ label, value, color, bg, border }) => (
                        <div key={label} className="rounded-2xl p-5"
                             style={{ background: bg, border: `1px solid ${border}` }}>
                            <p className="text-xs font-medium mb-2" style={{ color: color, opacity: 0.8 }}>{label}</p>
                            <p className="text-2xl font-bold" style={{ color }}>
                                {loading ? '—' : value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="mb-10">
                    <h2 className="text-lg font-semibold text-zinc-300 mb-4">Quick actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickActions.map(({ label, desc, icon, path, color }) => (
                            <button key={path} onClick={() => navigate(path)}
                                className="rounded-2xl p-5 text-left transition-all hover:scale-105 active:scale-95"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <div className="text-2xl mb-3">{icon}</div>
                                <p className="text-sm font-semibold text-white mb-1">{label}</p>
                                <p className="text-xs text-zinc-500">{desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Bookings */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-zinc-300">Recent bookings</h2>
                        <button onClick={() => navigate('/my-bookings')}
                            className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                            View all →
                        </button>
                    </div>

                    {loading ? (
                        <div className="rounded-2xl p-8 text-center text-zinc-600 text-sm"
                             style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            Loading...
                        </div>
                    ) : recentBookings.length === 0 ? (
                        <div className="rounded-2xl p-8 text-center"
                             style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <p className="text-zinc-500 text-sm mb-3">No bookings yet.</p>
                            <button onClick={() => navigate('/rides')}
                                className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
                                style={{ background: '#7C3AED' }}>
                                Find your first ride
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {recentBookings.map(b => (
                                <div key={b.BookingID}
                                     className="rounded-2xl px-5 py-4 flex justify-between items-center"
                                     style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div>
                                        <p className="text-sm font-semibold text-white">
                                            {b.Source} → {b.Destination}
                                        </p>
                                        <p className="text-xs text-zinc-500 mt-0.5">
                                            {b.DriverName} · {new Date(b.BookingTime).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-purple-300">Rs. {b.TotalFare}</p>
                                        <span className="text-xs" style={{
                                            color: b.BookingStatus === 'Confirmed' ? '#a78bfa' :
                                                   b.BookingStatus === 'Cancelled' ? '#f87171' : '#a1a1aa'
                                        }}>
                                            {b.BookingStatus}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;