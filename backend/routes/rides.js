const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../config/db');

// GET - Search rides
router.get('/', async (req, res) => {
    try {
        const { source, destination, date } = req.query;
        const pool = getPool();
        
        let query = `
            SELECT r.RideID, r.DriverID, u.Name as DriverName, u.Rating as DriverRating,
                   r.Source, r.Destination, r.DepartureTime, r.AvailableSeats, r.PricePerSeat, r.Status,
                   v.Make as VehicleMake, v.Model as VehicleModel, v.Color as VehicleColor
            FROM Rides r
            LEFT JOIN Users u ON r.DriverID = u.UserID
            LEFT JOIN Vehicles v ON r.VehicleID = v.VehicleID
            WHERE r.Status = 'Active' AND r.DepartureTime > GETDATE()
        `;
        
        const request = pool.request();
        const conditions = [];

        if (source) {
            conditions.push("r.Source LIKE '%' + @source + '%'");
            request.input('source', sql.VarChar, source);
        }
        if (destination) {
            conditions.push("r.Destination LIKE '%' + @dest + '%'");
            request.input('dest', sql.VarChar, destination);
        }
        if (date) {
            conditions.push("CAST(r.DepartureTime AS DATE) = @date");
            request.input('date', sql.Date, date);
        }

        if (conditions.length > 0) {
            query += " AND " + conditions.join(" AND ");
        }

        const result = await request.query(query);

        res.json({ success: true, data: result.recordset });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET - Get single ride
router.get('/:id', async (req, res) => {
    try {
        const rideId = req.params.id;
        const pool = getPool();

        const rideQuery = `
            SELECT r.RideID, r.DriverID, u.Name as DriverName, u.Rating as DriverRating,
                   r.Source, r.Destination, r.DepartureTime, r.AvailableSeats, r.PricePerSeat, r.Status,
                   v.Make as VehicleMake, v.Model as VehicleModel, v.Color as VehicleColor
            FROM Rides r
            LEFT JOIN Users u ON r.DriverID = u.UserID
            LEFT JOIN Vehicles v ON r.VehicleID = v.VehicleID
            WHERE r.RideID = @id
        `;
        
        const rideResult = await pool.request()
            .input('id', sql.Int, rideId)
            .query(rideQuery);

        if (rideResult.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Ride not found' });
        }

        const ride = rideResult.recordset[0];

        const waypointsQuery = `
            SELECT * FROM Routes
            WHERE RideID = @id
            ORDER BY WaypointOrder
        `;
        
        const waypointsResult = await pool.request()
            .input('id', sql.Int, rideId)
            .query(waypointsQuery);

        res.json({ success: true, data: { ...ride, waypoints: waypointsResult.recordset } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST - Create a new ride
router.post('/', async (req, res) => {
    try {
        const { source, destination, departureTime, availableSeats, pricePerSeat, vehicleId } = req.body;

        res.status(201).json({
            success: true,
            message: 'Ride created successfully',
            data: { source, destination, departureTime, availableSeats, pricePerSeat, vehicleId }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT - Update a ride
router.put('/:id', async (req, res) => {
    try {
        const rideId = req.params.id;
        const updates = req.body;

        res.status(200).json({
            success: true,
            message: `Ride ${rideId} updated successfully`,
            data: updates
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE - Delete a ride
router.delete('/:id', async (req, res) => {
    try {
        const rideId = req.params.id;

        res.status(200).json({
            success: true,
            message: `Ride ${rideId} deleted successfully`
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;