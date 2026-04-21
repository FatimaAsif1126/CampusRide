const express = require('express');
const router = express.Router();
const sql = require('mssql');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/bookings - Create a booking
router.post('/', authMiddleware, async (req, res) => {
    const { rideId, seatsToBook } = req.body;
    const passengerId = req.user.UserID;

    try {
        const pool = await sql.connect();

        // Check ride availability
        const rideResult = await pool.request()
            .input('RideID', sql.Int, rideId)
            .query('SELECT AvailableSeats, PricePerSeat, Status FROM Rides WHERE RideID = @RideID');

        if (rideResult.recordset.length === 0) return res.status(404).json({ message: 'Ride not found' });

        const ride = rideResult.recordset[0];
        if (ride.Status !== 'Active') return res.status(400).json({ message: 'Ride is no longer active' });
        if (ride.AvailableSeats < seatsToBook) return res.status(400).json({ message: 'Not enough seats' });

        const totalFare = ride.PricePerSeat * seatsToBook;

        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            const request = new sql.Request(transaction);

            await request
                .input('RideID', sql.Int, rideId)
                .input('PassengerID', sql.Int, passengerId)
                .input('SeatsBooked', sql.Int, seatsToBook)
                .input('TotalFare', sql.Decimal(10, 2), totalFare)
                .query(`
                    INSERT INTO Bookings (RideID, PassengerID, SeatsBooked, TotalFare, BookingTime, Status)
                    VALUES (@RideID, @PassengerID, @SeatsBooked, @TotalFare, GETDATE(), 'Confirmed')
                `);

            await request
                .query(`UPDATE Rides SET AvailableSeats = AvailableSeats - @SeatsBooked WHERE RideID = @RideID`);

            await transaction.commit();
            res.status(201).json({ message: 'Booking confirmed', totalFare });
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/bookings/my - Get user's bookings
router.get('/my', authMiddleware, async (req, res) => { 
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('PassengerID', sql.Int, req.user.UserID)
            .query(`
                SELECT b.BookingID, b.SeatsBooked, b.TotalFare, b.BookingTime, b.Status as BookingStatus,
                       r.Source, r.Destination, r.DepartureTime, r.Status as RideStatus,
                       u.Name as DriverName
                FROM Bookings b
                JOIN Rides r ON b.RideID = r.RideID
                JOIN Users u ON r.DriverID = u.UserID
                WHERE b.PassengerID = @PassengerID
                ORDER BY b.BookingTime DESC
            `);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// PUT /api/bookings/:id/cancel - Cancel booking
router.put('/:id/cancel', authMiddleware, async (req, res) => {  
    try {
        const pool = await sql.connect();

        const bookingResult = await pool.request()
            .input('BookingID', sql.Int, req.params.id)
            .input('PassengerID', sql.Int, req.user.UserID)
            .query('SELECT RideID, SeatsBooked, Status FROM Bookings WHERE BookingID = @BookingID AND PassengerID = @PassengerID');

        if (bookingResult.recordset.length === 0) return res.status(404).json({ message: 'Booking not found' });

        const booking = bookingResult.recordset[0];
        if (booking.Status !== 'Confirmed') return res.status(400).json({ message: 'Only confirmed bookings can be cancelled' });

        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            const request = new sql.Request(transaction);

            await request
                .input('BookingID', sql.Int, req.params.id)
                .query("UPDATE Bookings SET Status = 'Cancelled' WHERE BookingID = @BookingID");

            await request
                .input('RideID', sql.Int, booking.RideID)
                .input('SeatsBooked', sql.Int, booking.SeatsBooked)
                .query("UPDATE Rides SET AvailableSeats = AvailableSeats + @SeatsBooked WHERE RideID = @RideID");

            await transaction.commit();
            res.json({ message: 'Booking cancelled' });
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;