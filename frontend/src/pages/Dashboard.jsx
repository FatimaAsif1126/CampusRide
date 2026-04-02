import Navbar from '../components/Navbar';

function Dashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center bg-[#0e0c15]" style={{ height: 'calc(100vh - 64px)' }}>
                <div className="text-center text-white">
                    <h1 className="text-3xl font-bold">Welcome, {user.name || 'User'}!</h1>
                    <p className="mt-2 text-zinc-400">You are logged in as {user.role || 'Passenger'}</p>
                </div>
            </div>
        </>
    );
}

export default Dashboard;