const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../config/db');
const auth = require('../middleware/authMiddleware');

// POST /api/bookings - Create a booking
router.post('/', auth, async (req, res) => {
    try {
        const { rideId, seatsToBook } = req.body;
        const passengerId = req.user.userId || req.user.UserID;

        const pool = getPool();

        // Check ride availability
        const rideResult = await pool.request()
            .input('RideID', sql.Int, rideId)
            .query('SELECT AvailableSeats, PricePerSeat, Status, DriverID FROM Rides WHERE RideID = @RideID');

        if (rideResult.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Ride not found' });
        }

        const ride = rideResult.recordset[0];

        if (ride.Status !== 'Active') {
            return res.status(400).json({ success: false, message: 'Ride is no longer active' });
        }

        if (ride.AvailableSeats < seatsToBook) {
            return res.status(400).json({ success: false, message: 'Not enough seats available' });
        }

        // Check if user already booked this ride
        const existingBooking = await pool.request()
            .input('RideID', sql.Int, rideId)
            .input('PassengerID', sql.Int, passengerId)
            .query("SELECT BookingID FROM Bookings WHERE RideID = @RideID AND PassengerID = @PassengerID AND Status IN ('Confirmed', 'Completed')");

        if (existingBooking.recordset.length > 0) {
            return res.status(400).json({ success: false, message: 'You have already booked this ride' });
        }

        const totalFare = ride.PricePerSeat * seatsToBook;

        // Create booking and update seats in a transaction
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Separate request objects for each query in the transaction
            const req1 = new sql.Request(transaction);
            const bookingResult = await req1
                .input('RideID', sql.Int, rideId)
                .input('PassengerID', sql.Int, passengerId)
                .input('SeatsBooked', sql.Int, seatsToBook)
                .input('TotalFare', sql.Decimal(10, 2), totalFare)
                .query(`
                    INSERT INTO Bookings (RideID, PassengerID, SeatsBooked, TotalFare, BookingTime, Status)
                    VALUES (@RideID, @PassengerID, @SeatsBooked, @TotalFare, GETDATE(), 'Confirmed');
                    SELECT SCOPE_IDENTITY() AS BookingID;
                `);

            const bookingId = bookingResult.recordset[0].BookingID;

            const req2 = new sql.Request(transaction);
            await req2
                .input('RideID', sql.Int, rideId)
                .input('SeatsBooked', sql.Int, seatsToBook)
                .query(`UPDATE Rides SET AvailableSeats = AvailableSeats - @SeatsBooked WHERE RideID = @RideID`);

            await transaction.commit();

            res.status(201).json({
                success: true,
                message: 'Booking confirmed!',
                bookingId: bookingId,
                totalFare: totalFare
            });

        } catch (err) {
            await transaction.rollback();
            throw err;
        }

    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/bookings/my - Get user's bookings
router.get('/my', auth, async (req, res) => {
    try {
        const passengerId = req.user.userId || req.user.UserID;
        const pool = getPool();

        const result = await pool.request()
            .input('PassengerID', sql.Int, passengerId)
            .query(`
                SELECT b.BookingID, b.SeatsBooked, b.TotalFare, b.BookingTime, b.Status as BookingStatus,
                       r.RideID, r.Source, r.Destination, r.DepartureTime, r.Status as RideStatus,
                       u.Name as DriverName, u.UserID as DriverID
                FROM Bookings b
                JOIN Rides r ON b.RideID = r.RideID
                JOIN Users u ON r.DriverID = u.UserID
                WHERE b.PassengerID = @PassengerID
                ORDER BY b.BookingTime DESC
            `);

        res.json({ success: true, data: result.recordset });

    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// PUT /api/bookings/:id/cancel - Cancel a booking
router.put('/:id/cancel', auth, async (req, res) => {
    try {
        const bookingId = req.params.id;
        const passengerId = req.user.userId || req.user.UserID;
        const pool = getPool();

        // Get booking details
        const bookingResult = await pool.request()
            .input('BookingID', sql.Int, bookingId)
            .input('PassengerID', sql.Int, passengerId)
            .query(`
                SELECT b.RideID, b.SeatsBooked, b.Status
                FROM Bookings b
                WHERE b.BookingID = @BookingID AND b.PassengerID = @PassengerID
            `);

        if (bookingResult.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        const booking = bookingResult.recordset[0];

        if (booking.Status !== 'Confirmed') {
            return res.status(400).json({ success: false, message: 'Only confirmed bookings can be cancelled' });
        }

        // Cancel booking and restore seats in a transaction
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            const req1 = new sql.Request(transaction);
            await req1
                .input('BookingID', sql.Int, bookingId)
                .query(`UPDATE Bookings SET Status = 'Cancelled' WHERE BookingID = @BookingID`);

            const req2 = new sql.Request(transaction);
            await req2
                .input('RideID', sql.Int, booking.RideID)
                .input('SeatsBooked', sql.Int, booking.SeatsBooked)
                .query(`UPDATE Rides SET AvailableSeats = AvailableSeats + @SeatsBooked WHERE RideID = @RideID`);

            await transaction.commit();
            res.json({ success: true, message: 'Booking cancelled successfully' });

        } catch (err) {
            await transaction.rollback();
            throw err;
        }

    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;