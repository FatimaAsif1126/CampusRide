import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

function getAvatarConfig(user) {
    const role = (user.role || '').toLowerCase();
    const gender = (user.gender || '').toLowerCase();

    if (role === 'driver' || role === 'ride') {
        return {
            svg: (
                <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <circle cx="60" cy="60" r="60" fill="#1e1a2e" />
                    <ellipse cx="60" cy="105" rx="34" ry="22" fill="#6d28d9" />
                    <path d="M48 90 Q60 100 72 90 L68 82 Q60 88 52 82 Z" fill="#4c1d95" />
                    <circle cx="60" cy="52" r="22" fill="#fcd5b0" />
                    <path d="M38 48 Q38 28 60 26 Q82 28 82 48 Q78 36 60 36 Q42 36 38 48Z" fill="#1c1917" />
                    <rect x="36" y="42" width="48" height="8" rx="4" fill="#7c3aed" />
                    <rect x="32" y="44" width="56" height="5" rx="2.5" fill="#6d28d9" />
                    <ellipse cx="52" cy="53" rx="3" ry="3.5" fill="#1c1917" />
                    <ellipse cx="68" cy="53" rx="3" ry="3.5" fill="#1c1917" />
                    <circle cx="53" cy="51.5" r="1" fill="white" />
                    <circle cx="69" cy="51.5" r="1" fill="white" />
                    <path d="M53 62 Q60 68 67 62" stroke="#c2855a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    <circle cx="60" cy="95" r="14" stroke="#a78bfa" strokeWidth="3" fill="none" />
                    <circle cx="60" cy="95" r="4" fill="#a78bfa" />
                    <line x1="60" y1="81" x2="60" y2="91" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="60" y1="99" x2="60" y2="109" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="46" y1="95" x2="56" y2="95" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="64" y1="95" x2="74" y2="95" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
            ),
            label: 'Driver',
            accent: 'from-violet-600 to-purple-800',
            badge: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
        };
    }

    if (gender === 'female' || gender === 'woman' || gender === 'f') {
        return {
            svg: (
                <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <circle cx="60" cy="60" r="60" fill="#1e1a2e" />
                    <path d="M26 120 Q30 88 42 82 Q50 96 60 96 Q70 96 78 82 Q90 88 94 120Z" fill="#be185d" />
                    <ellipse cx="42" cy="82" rx="10" ry="6" fill="#fcd5b0" />
                    <ellipse cx="78" cy="82" rx="10" ry="6" fill="#fcd5b0" />
                    <rect x="55" y="72" width="10" height="14" rx="5" fill="#fcd5b0" />
                    <circle cx="60" cy="52" r="22" fill="#fcd5b0" />
                    <path d="M38 50 Q36 72 40 88 Q44 76 42 64 Q40 56 38 50Z" fill="#7c2d12" />
                    <path d="M82 50 Q84 72 80 88 Q76 76 78 64 Q80 56 82 50Z" fill="#7c2d12" />
                    <path d="M38 46 Q38 26 60 24 Q82 26 82 46 Q78 34 60 34 Q42 34 38 46Z" fill="#7c2d12" />
                    <ellipse cx="52" cy="52" rx="3" ry="3.5" fill="#1c1917" />
                    <ellipse cx="68" cy="52" rx="3" ry="3.5" fill="#1c1917" />
                    <circle cx="53" cy="50.5" r="1" fill="white" />
                    <circle cx="69" cy="50.5" r="1" fill="white" />
                    <path d="M49 49 L47 47M52 48 L51 46M55 49 L55 47" stroke="#1c1917" strokeWidth="1" strokeLinecap="round" />
                    <path d="M65 49 L63 47M68 48 L67 46M71 49 L71 47" stroke="#1c1917" strokeWidth="1" strokeLinecap="round" />
                    <path d="M53 61 Q60 67 67 61" stroke="#c2855a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    <circle cx="38" cy="56" r="2.5" fill="#f472b6" />
                    <circle cx="82" cy="56" r="2.5" fill="#f472b6" />
                </svg>
            ),
            label: 'Passenger',
            accent: 'from-pink-600 to-rose-800',
            badge: 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
        };
    }

    // Default: male
    return {
        svg: (
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="60" cy="60" r="60" fill="#1e1a2e" />
                <path d="M26 120 Q28 90 42 84 Q48 94 60 94 Q72 94 78 84 Q92 90 94 120Z" fill="#1d4ed8" />
                <path d="M50 84 Q60 92 70 84 L66 76 Q60 82 54 76Z" fill="#1e3a8a" />
                <rect x="55" y="72" width="10" height="13" rx="5" fill="#fcd5b0" />
                <circle cx="60" cy="52" r="22" fill="#fcd5b0" />
                <path d="M38 46 Q38 26 60 24 Q82 26 82 46 Q80 38 72 35 Q66 32 60 32 Q54 32 48 35 Q40 38 38 46Z" fill="#1c1917" />
                <rect x="38" y="44" width="4" height="10" rx="2" fill="#1c1917" />
                <rect x="78" y="44" width="4" height="10" rx="2" fill="#1c1917" />
                <ellipse cx="52" cy="53" rx="3" ry="3.5" fill="#1c1917" />
                <ellipse cx="68" cy="53" rx="3" ry="3.5" fill="#1c1917" />
                <circle cx="53" cy="51.5" r="1" fill="white" />
                <circle cx="69" cy="51.5" r="1" fill="white" />
                <path d="M53 63 Q60 69 67 63" stroke="#c2855a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
        ),
        label: 'Passenger',
        accent: 'from-blue-600 to-indigo-800',
        badge: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    };
}

function Field({ label, value }) {
    return (
        <div className="flex items-start gap-4 py-4 border-b border-white/5 last:border-0">
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-0.5">{label}</p>
                <p className="text-white text-base truncate">
                    {value || <span className="text-zinc-600 italic text-sm">Not set</span>}
                </p>
            </div>
        </div>
    );
}

function Profile() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const avatar = getAvatarConfig(user);

    return (
        <div className="fixed inset-0 z-50 bg-[#0a0812] flex items-center justify-center p-4 overflow-y-auto">

            {/* Ambient glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${avatar.accent} opacity-5 pointer-events-none`} />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[120px] opacity-10 bg-violet-500 pointer-events-none" />

            {/* Close button */}
            <button
                onClick={() => navigate('/dashboard')}
                className="fixed top-5 right-5 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 backdrop-blur-sm"
                aria-label="Close profile"
            >
                <X size={18} />
            </button>

            {/* Card */}
            <div className="relative w-full max-w-sm">

                {/* Avatar section */}
                <div className="flex flex-col items-center mb-6">
                    <div className={`relative p-1 rounded-full bg-gradient-to-br ${avatar.accent} mb-4 shadow-lg`}>
                        <div className="w-28 h-28 rounded-full overflow-hidden bg-[#1e1a2e] border-2 border-[#0a0812]">
                            {avatar.svg}
                        </div>
                        {/* Online dot */}
                        <span className="absolute bottom-1.5 right-1.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0a0812]" />
                    </div>

                    <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                        {user.name || 'Anonymous'}
                    </h1>
                    <span className={`text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full ${avatar.badge}`}>
                        {avatar.label}
                    </span>
                </div>

                {/* Info card */}
                <div className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl rounded-3xl px-6 pt-2 pb-4">
                    <Field label="Full Name" value={user.name} />
                    <Field label="Email" value={user.email} />
                    <Field label="Phone" value={user.phone} />
                    <Field label="Gender" value={user.gender} />
                    <Field label="Role" value={user.role} />
                </div>

                <p className="text-center text-zinc-700 text-xs mt-5 tracking-wide">
                    {user.email || 'No email on record'}
                </p>
            </div>
        </div>
    );
}

export default Profile;