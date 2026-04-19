import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function Profile() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#0e0c15] p-8">
                <div className="max-w-md mx-auto bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8">
                    {/* Back button */}
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="mb-4 flex items-center gap-2 text-purple-400 hover:text-purple-300 transition"
                    >
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </button>
                    
                    <h1 className="text-2xl font-bold text-white mb-6">My Profile</h1>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-zinc-500 text-sm">Full Name</label>
                            <p className="text-white text-lg">{user.name || 'Not set'}</p>
                        </div>
                        
                        <div>
                            <label className="text-zinc-500 text-sm">Email</label>
                            <p className="text-white text-lg">{user.email || 'Not set'}</p>
                        </div>
                        
                        <div>
                            <label className="text-zinc-500 text-sm">Phone</label>
                            <p className="text-white text-lg">{user.phone || 'Not set'}</p>
                        </div>
                        
                        <div>
                            <label className="text-zinc-500 text-sm">Gender</label>
                            <p className="text-white text-lg">{user.gender || 'Not set'}</p>
                        </div>
                        
                        <div>
                            <label className="text-zinc-500 text-sm">Role</label>
                            <p className="text-white text-lg">{user.role || 'Not set'}</p>
                        </div>
                    </div>
                    
                    {/* Edit Profile button removed */}
                </div>
            </div>
        </>
    );
}

export default Profile;