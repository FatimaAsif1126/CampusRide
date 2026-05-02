import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Wallet, Smartphone, Banknote, ArrowLeft } from 'lucide-react';

const paymentMethods = [
    { id: 'JazzCash',      label: 'JazzCash',       icon: Smartphone,  color: '#EF4444', bg: '#FEF2F2' },
    { id: 'EasyPaisa',     label: 'EasyPaisa',      icon: Smartphone,  color: '#10B981', bg: '#ECFDF5' },
    { id: 'Credit Card',   label: 'Credit Card',    icon: CreditCard,  color: '#3B82F6', bg: '#EFF6FF' },
    { id: 'Debit Card',    label: 'Debit Card',     icon: CreditCard,  color: '#8B5CF6', bg: '#F5F3FF' },
    { id: 'In-App Wallet', label: 'In-App Wallet',  icon: Wallet,      color: '#F59E0B', bg: '#FFFBEB' },
    { id: 'Cash',          label: 'Cash on Ride',   icon: Banknote,    color: '#6B7280', bg: '#F9FAFB' },
];

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingId, totalFare, source, destination } = location.state || {};

    const [selectedMethod, setSelectedMethod] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!bookingId) navigate('/rides');
    }, [bookingId, navigate]);

    const handlePay = async () => {
        if (!selectedMethod) {
            setError('Please select a payment method.');
            return;
        }

        setLoading(true);
        setError('');
        setProcessing(true);

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bookingId,
                    paymentMethod: selectedMethod
                })
            });

            const data = await response.json();

            if (data.success) {
                setTransactionId(data.transactionId);
                setSuccess(true);
            } else {
                setError(data.message || 'Payment failed. Please try again.');
            }
        } catch (err) {
            setError('Failed to connect to server.');
        } finally {
            setLoading(false);
            setProcessing(false);
        }
    };

    // ── SUCCESS SCREEN ──────────────────────────────────────
    if (success) {
        return (
            <div className="min-h-screen bg-[#0e0c15] flex items-center justify-center px-4">
                <div className="bg-white rounded-3xl p-10 w-full max-w-md text-center shadow-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle size={48} className="text-green-500" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
                    <p className="text-gray-500 mb-6">Your ride is confirmed and paid.</p>

                    <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Route</span>
                            <span className="font-medium text-gray-800">{source} → {destination}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Amount Paid</span>
                            <span className="font-bold text-green-600">Rs. {totalFare}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Method</span>
                            <span className="font-medium text-gray-800">{selectedMethod}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Transaction ID</span>
                            <span className="font-mono text-xs text-purple-600">{transactionId}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/my-bookings')}
                        className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
                    >
                        View My Bookings
                    </button>
                </div>
            </div>
        );
    }

    // ── PAYMENT FORM ────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#0e0c15] flex items-center justify-center px-4"
             style={{ fontFamily: "'Sora', sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');`}</style>

            <div className="w-full max-w-md">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 text-sm transition-colors"
                >
                    <ArrowLeft size={16} /> Back
                </button>

                <div className="bg-white rounded-3xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest text-purple-600 bg-purple-50 border border-purple-200 mb-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                            CAMPUSRIDE PAY
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Complete Payment</h2>
                        <p className="text-gray-500 text-sm mt-1">{source} → {destination}</p>
                    </div>

                    {/* Amount */}
                    <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 mb-6 flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Total Amount</span>
                        <span className="text-3xl font-bold text-purple-600">Rs. {totalFare}</span>
                    </div>

                    {/* Payment Methods */}
                    <p className="text-sm font-semibold text-gray-700 mb-3">Select Payment Method</p>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {paymentMethods.map(({ id, label, icon: Icon, color, bg }) => (
                            <button
                                key={id}
                                onClick={() => setSelectedMethod(id)}
                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                                    selectedMethod === id
                                        ? 'border-purple-500 bg-purple-50 shadow-md scale-105'
                                        : 'border-gray-100 bg-gray-50 hover:border-gray-300'
                                }`}
                            >
                                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                                     style={{ background: bg }}>
                                    <Icon size={20} style={{ color }} />
                                </div>
                                <span className="text-xs font-semibold text-gray-700 text-center leading-tight">
                                    {label}
                                </span>
                                {selectedMethod === id && (
                                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Card details UI for card methods */}
                    {(selectedMethod === 'Credit Card' || selectedMethod === 'Debit Card') && (
                        <div className="bg-gray-50 rounded-2xl p-4 mb-4 space-y-3">
                            <input
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:border-purple-400"
                            />
                            <div className="flex gap-3">
                                <input placeholder="MM/YY" maxLength={5}
                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400" />
                                <input placeholder="CVV" maxLength={3}
                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400" />
                            </div>
                            <input placeholder="Cardholder Name"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400" />
                        </div>
                    )}

                    {/* Mobile number for JazzCash/EasyPaisa */}
                    {(selectedMethod === 'JazzCash' || selectedMethod === 'EasyPaisa') && (
                        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                            <input
                                placeholder="03XX-XXXXXXX"
                                maxLength={12}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400"
                            />
                            <p className="text-xs text-gray-400 mt-2">
                                A confirmation will be sent to this number
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Pay Button */}
                    <button
                        onClick={handlePay}
                        disabled={loading || !selectedMethod}
                        className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold text-lg transition-colors flex items-center justify-center gap-3"
                    >
                        {processing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            `Pay Rs. ${totalFare}`
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-4">
                        🔒 Secured by CampusRide Pay
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Payment;