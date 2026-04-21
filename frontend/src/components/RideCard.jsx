import React from 'react';

function RideCard({ ride, onClick }) {
    return (
        <>
            <style>{`
                .ride-card-hover {
                    transition: border-color 0.2s ease;
                }
                .ride-card-hover:hover {
                    border-color: rgba(139,92,246,0.4);
                }
            `}</style>
            <div 
                onClick={onClick}
                className="ride-card-hover cursor-pointer bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl px-7 py-6 flex justify-between items-center"
            >
                <div className="flex flex-col gap-2">
                    <div className="text-[17px] font-semibold text-[#ede9fe]">
                        {ride.Source} {'->'} {ride.Destination}
                    </div>
                    <div className="text-[13px] text-zinc-400">
                        {new Date(ride.DepartureTime).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                    <div className="text-[13px] text-zinc-400">
                        {ride.DriverName} · ★ {ride.DriverRating || 'N/A'}
                    </div>
                    <div className="text-[12px] text-zinc-500">
                        {ride.VehicleMake} {ride.VehicleModel} · {ride.VehicleColor}
                    </div>
                </div>

                <div className="flex flex-col items-end gap-8">
                    <div className="text-[18px] font-bold text-[#a78bfa]">
                        Rs. {ride.PricePerSeat}/seat
                    </div>
                    <div className={`text-[12px] ${ride.AvailableSeats <= 2 ? 'text-[#f87171]' : 'text-zinc-400'}`}>
                        {ride.AvailableSeats} seats left
                    </div>
                </div>
            </div>
        </>
    );
}

export default RideCard;
