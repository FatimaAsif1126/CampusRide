-- ============================================================
-- 1. CONSTRAINTS & RELATIONSHIPS (already in phase1, this adds one more)
-- Fix: Add 'Full' to Rides Status CHECK constraint
-- ============================================================
DECLARE @ConstraintName NVARCHAR(200);
SELECT @ConstraintName = name
FROM sys.check_constraints
WHERE parent_object_id = OBJECT_ID('Rides') AND name LIKE '%Status%';
IF @ConstraintName IS NOT NULL
    EXEC('ALTER TABLE Rides DROP CONSTRAINT ' + @ConstraintName);
GO

ALTER TABLE Rides
ADD CONSTRAINT CK_Rides_Status
CHECK (Status IN ('Active', 'Completed', 'Cancelled', 'In Progress', 'Full'));
GO
PRINT ' Constraint: Rides Status updated to include Full.';
GO

-- ============================================================
-- 2. TRIGGERS
-- ============================================================

-- BookingLog table needed for Trigger 3
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='BookingLog' AND xtype='U')
BEGIN
    CREATE TABLE BookingLog (
        LogID       INT IDENTITY(1,1) PRIMARY KEY,
        BookingID   INT NOT NULL,
        RideID      INT NOT NULL,
        PassengerID INT NOT NULL,
        SeatsBooked INT NOT NULL,
        TotalFare   DECIMAL(10,2) NOT NULL,
        CancelledAt DATETIME DEFAULT GETDATE(),
        Action      VARCHAR(50) DEFAULT 'CANCELLED'
    );
    PRINT ' BookingLog audit table created.';
END
GO

-- TRIGGER 1: Prevent Overbooking
-- Fires AFTER INSERT on Bookings
-- Rolls back if AvailableSeats goes below 0
CREATE OR ALTER TRIGGER trg_PreventOverbooking
ON Bookings AFTER INSERT AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (
        SELECT 1 FROM inserted i
        JOIN Rides r ON i.RideID = r.RideID
        WHERE r.AvailableSeats < 0
    )
    BEGIN
        RAISERROR('Booking failed: Not enough available seats.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO
PRINT ' Trigger 1 (trg_PreventOverbooking) created.';
GO

-- TRIGGER 2: Auto-mark Ride as Full when AvailableSeats = 0
-- Fires AFTER UPDATE on Rides
CREATE OR ALTER TRIGGER trg_AutoMarkRideFull
ON Rides AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Rides SET Status = 'Full'
    WHERE RideID IN (SELECT RideID FROM inserted WHERE AvailableSeats = 0)
    AND Status = 'Active';
END;
GO
PRINT ' Trigger 2 (trg_AutoMarkRideFull) created.';
GO

-- TRIGGER 3: Log Cancelled Bookings into BookingLog (Audit Trail)
-- Fires AFTER UPDATE on Bookings when Status changes to Cancelled
CREATE OR ALTER TRIGGER trg_LogCancelledBooking
ON Bookings AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (
        SELECT 1 FROM inserted i
        JOIN deleted d ON i.BookingID = d.BookingID
        WHERE i.Status = 'Cancelled' AND d.Status != 'Cancelled'
    )
    BEGIN
        INSERT INTO BookingLog (BookingID, RideID, PassengerID, SeatsBooked, TotalFare, CancelledAt, Action)
        SELECT i.BookingID, i.RideID, i.PassengerID, i.SeatsBooked, i.TotalFare, GETDATE(), 'CANCELLED'
        FROM inserted i
        JOIN deleted d ON i.BookingID = d.BookingID
        WHERE i.Status = 'Cancelled' AND d.Status != 'Cancelled';
    END
END;
GO
PRINT ' Trigger 3 (trg_LogCancelledBooking) created.';
GO

-- TRIGGER 4: Prevent Driver from Booking Their Own Ride
-- Fires AFTER INSERT on Bookings
CREATE OR ALTER TRIGGER trg_PreventSelfBooking
ON Bookings AFTER INSERT AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (
        SELECT 1 FROM inserted i
        JOIN Rides r ON i.RideID = r.RideID
        WHERE r.DriverID = i.PassengerID
    )
    BEGIN
        RAISERROR('A driver cannot book their own ride.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO
PRINT ' Trigger 4 (trg_PreventSelfBooking) created.';
GO

-- ============================================================
-- 3. TRANSACTIONS
-- ============================================================

-- TRANSACTION 1: Create a Booking
-- Both INSERT into Bookings AND UPDATE of AvailableSeats
-- must succeed together or both roll back
BEGIN TRANSACTION;
BEGIN TRY
    INSERT INTO Bookings (RideID, PassengerID, SeatsBooked, TotalFare, Status)
    VALUES (4, 6, 1, 350.00, 'Confirmed');

    UPDATE Rides
    SET AvailableSeats = AvailableSeats - 1
    WHERE RideID = 4;

    COMMIT TRANSACTION;
    PRINT ' Transaction 1 committed: Booking created, seat deducted.';
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    PRINT ' Transaction 1 rolled back: ' + ERROR_MESSAGE();
END CATCH;
GO

-- TRANSACTION 2: Cancel a Booking
-- Both UPDATE Bookings to Cancelled AND restore seats
-- must succeed together or both roll back
BEGIN TRANSACTION;
BEGIN TRY
    DECLARE @SeatsToRestore INT;
    DECLARE @RideToUpdate   INT;

    SELECT @SeatsToRestore = SeatsBooked, @RideToUpdate = RideID
    FROM Bookings WHERE BookingID = 7;

    UPDATE Bookings
    SET Status = 'Cancelled'
    WHERE BookingID = 7;

    UPDATE Rides
    SET AvailableSeats = AvailableSeats + @SeatsToRestore
    WHERE RideID = @RideToUpdate;

    COMMIT TRANSACTION;
    PRINT ' Transaction 2 committed: Booking cancelled, seats restored.';
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    PRINT ' Transaction 2 rolled back: ' + ERROR_MESSAGE();
END CATCH;
GO

-- ============================================================
-- 4. SQL QUERIES — CRUD, JOINS, GROUPING (for viva)
-- ============================================================

-- INSERT (CREATE)
INSERT INTO Notifications (UserID, Type, Message, IsRead)
VALUES (2, 'System', 'Welcome to CampusRide Phase 3!', 0);
GO

-- SELECT with WHERE (READ)
SELECT RideID, Source, Destination, AvailableSeats, PricePerSeat, Status
FROM Rides
WHERE Status = 'Active' AND AvailableSeats > 0
ORDER BY DepartureTime;
GO

-- UPDATE
UPDATE Users
SET Rating = (
    SELECT AVG(CAST(Rating AS DECIMAL(3,2)))
    FROM Reviews
    WHERE RevieweeID = 1
)
WHERE UserID = 1;
GO

-- DELETE
DELETE FROM Notifications WHERE IsRead = 1;
GO

-- INNER JOIN — Booking history with passenger and driver names
SELECT b.BookingID,
       p.Name AS PassengerName,
       d.Name AS DriverName,
       r.Source, r.Destination,
       b.SeatsBooked, b.TotalFare, b.Status
FROM Bookings b
JOIN Users p ON b.PassengerID = p.UserID
JOIN Rides r  ON b.RideID = r.RideID
JOIN Users d  ON r.DriverID = d.UserID
ORDER BY b.BookingTime DESC;
GO

-- GROUP BY + COUNT + SUM — Revenue per driver
SELECT u.Name AS DriverName,
       COUNT(b.BookingID) AS TotalBookings,
       SUM(b.TotalFare)   AS TotalRevenue,
       AVG(b.TotalFare)   AS AvgFare
FROM Users u
JOIN Rides r    ON u.UserID = r.DriverID
JOIN Bookings b ON r.RideID = b.RideID
WHERE b.Status = 'Confirmed'
GROUP BY u.UserID, u.Name
ORDER BY TotalRevenue DESC;
GO

-- GROUP BY + HAVING — Rides with more than 1 booking
SELECT r.RideID, r.Source, r.Destination,
       COUNT(b.BookingID) AS TotalBookings
FROM Rides r
JOIN Bookings b ON r.RideID = b.RideID
GROUP BY r.RideID, r.Source, r.Destination
HAVING COUNT(b.BookingID) > 1;
GO

-- LEFT JOIN — All users and their booking count (including those with 0)
SELECT u.Name, u.Role,
       COUNT(b.BookingID) AS BookingCount
FROM Users u
LEFT JOIN Bookings b ON u.UserID = b.PassengerID
GROUP BY u.UserID, u.Name, u.Role
ORDER BY BookingCount DESC;
GO

-- SUBQUERY — Passengers who never booked
SELECT Name, Email FROM Users
WHERE UserID NOT IN (SELECT PassengerID FROM Bookings)
AND Role IN ('Passenger', 'Both');
GO

-- CASE statement — Categorize rides by occupancy
SELECT RideID, Source, Destination, AvailableSeats,
       CASE
           WHEN AvailableSeats = 0 THEN 'Full'
           WHEN AvailableSeats = 1 THEN 'Almost Full'
           WHEN AvailableSeats <= 3 THEN 'Filling Up'
           ELSE 'Available'
       END AS OccupancyStatus
FROM Rides
WHERE Status = 'Active';
GO

-- ============================================================
-- 5. VERIFY ALL TRIGGERS CREATED
-- ============================================================
SELECT name AS TriggerName, OBJECT_NAME(parent_id) AS OnTable
FROM sys.triggers
WHERE parent_id IN (OBJECT_ID('Bookings'), OBJECT_ID('Rides'));
GO

SELECT * FROM BookingLog;
GO

PRINT ' Phase 3 complete! Triggers, Transactions, Constraints, and Queries all set up.';
GO