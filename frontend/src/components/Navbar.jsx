import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Calendar, Search, Wallet, Plus, Car, Star, Bell, LayoutDashboard } from 'lucide-react';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || 'Passenger';
    const isDriver = role === 'Driver' || role === 'Both';
    const isPassenger = role === 'Passenger' || role === 'Both';

    if (!token) return null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');`}</style>
            <nav style={{ fontFamily: "'Sora', sans-serif" }}
                className="bg-[#110d1e]/80 backdrop-blur-xl border-b border-white/10 text-white px-8 py-3.5 flex justify-between items-center sticky top-0 z-50">

                {/* Logo */}
                <Link to="/dashboard" className="flex items-center gap-2.5 no-underline">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest text-purple-400 bg-purple-900/20 border border-purple-700/40">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        CAMPUSRIDE
                    </div>
                </Link>

                {/* Center nav — role based */}
                <div className="flex items-center gap-1">
                    {/* Dashboard link - everyone sees */}
                    <Link to="/dashboard"
                        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-purple-300 transition-colors px-3 py-1.5 rounded-xl hover:bg-purple-900/20">
                        <LayoutDashboard size={14} />
                        Dashboard
                    </Link>

                    {/* Driver links */}
                    {isDriver && (
                        <>
                            <Link to="/create-ride"
                                className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-purple-300 transition-colors px-3 py-1.5 rounded-xl hover:bg-purple-900/20">
                                <Plus size={14} />
                                Create Ride
                            </Link>
                            <Link to="/my-rides"
                                className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-purple-300 transition-colors px-3 py-1.5 rounded-xl hover:bg-purple-900/20">
                                <Car size={14} />
                                My Rides
                            </Link>
                        </>
                    )}

                    {/* Passenger links */}
                    {isPassenger && (
                        <>
                            <Link to="/rides"
                                className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-purple-300 transition-colors px-3 py-1.5 rounded-xl hover:bg-purple-900/20">
                                <Search size={14} />
                                Find Rides
                            </Link>
                            <Link to="/my-bookings"
                                className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-purple-300 transition-colors px-3 py-1.5 rounded-xl hover:bg-purple-900/20">
                                <Calendar size={14} />
                                My Bookings
                            </Link>
                        </>
                    )}

                    {/* Everyone sees these */}
                    <Link to="/wallet"
                        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-purple-300 transition-colors px-3 py-1.5 rounded-xl hover:bg-purple-900/20">
                        <Wallet size={14} />
                        Wallet
                    </Link>
                    <Link to="/reviews"
                        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-purple-300 transition-colors px-3 py-1.5 rounded-xl hover:bg-purple-900/20">
                        <Star size={14} />
                        Reviews
                    </Link>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {/* Notification Bell */}
                    <Link to="/notifications"
                        className="relative flex items-center justify-center w-8 h-8 rounded-xl text-zinc-400 hover:text-purple-300 hover:bg-purple-900/20 transition-colors">
                        <Bell size={16} />
                        {/* Red dot — always show, will be dynamic */}
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border border-[#110d1e]" />
                    </Link>

                    <div className="w-px h-4 bg-white/10" />

                    <span className="text-sm text-zinc-400 font-light">
                        Hello, <span className="text-purple-300 font-medium">{user.name}</span>
                    </span>

                    <div className="w-px h-4 bg-white/10" />

                    <Link to="/profile"
                        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-purple-300 transition-colors px-3 py-1.5 rounded-xl hover:bg-purple-900/20 border border-transparent hover:border-purple-700/30">
                        <User size={14} />
                        Profile
                    </Link>

                    <button onClick={handleLogout}
                        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-xl hover:bg-red-900/10 border border-transparent hover:border-red-700/20">
                        <LogOut size={14} />
                        Logout
                    </button>
                </div>
            </nav>
        </>
    );
}

export default Navbar;