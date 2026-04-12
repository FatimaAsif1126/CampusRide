const express = require('express');
const router = express.Router();

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