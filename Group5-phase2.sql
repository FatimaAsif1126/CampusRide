
-------------------------------------------------------------------------
-- PHASE 2: Implementing Functionalities
-------------------------------------------------------------------------

-- 1. INSERTIONS (10 records for each table)

-- 1. USERS
INSERT INTO Users (Name, Email, PasswordHash, Phone, Role, Gender, Rating, IsVerified) VALUES 
('Ahmad Ali', 'ahmad@example.com', 'hash1', '03001111111', 'Both', 'M', 4.8, 1),
('Sara Khan', 'sara@example.com', 'hash2', '03002222222', 'Passenger', 'F', 4.5, 1),
('Usman Tariq', 'usman@example.com', 'hash3', '03003333333', 'Driver', 'M', 4.9, 1),
('Mina Raza', 'mina@example.com', 'hash4', '03004444444', 'Passenger', 'F', 4.2, 0),
('Zain Malik', 'zain@example.com', 'hash5', '03005555555', 'Both', 'M', 5.0, 1),
('Fatima Noor', 'fatima@example.com', 'hash6', '03006666666', 'Passenger', 'F', 3.9, 1),
('Bilal Ahmed', 'bilal@example.com', 'hash7', '03007777777', 'Driver', 'M', 4.6, 1),
('Ayesha Gul', 'ayesha@example.com', 'hash8', '03008888888', 'Passenger', 'F', 4.7, 1),
('Omar Farooq', 'omar@example.com', 'hash9', '03009999999', 'Both', 'M', 4.1, 0),
('Nida Shah', 'nida@example.com', 'hash10', '03001010101', 'Passenger', 'F', 4.8, 1);
GO

-- 2. VEHICLES
INSERT INTO Vehicles (OwnerID, Make, Model, Year, Color, LicensePlate, Capacity, AC_Available, InsuranceExpiry) VALUES 
(1, 'Toyota', 'Corolla', 2018, 'White', 'ABC-123', 4, 1, '2026-12-31'),
(3, 'Honda', 'Civic', 2020, 'Black', 'DEF-456', 4, 1, '2026-10-15'),
(5, 'Suzuki', 'Cultus', 2015, 'Silver', 'GHI-789', 4, 1, '2027-01-20'),
(7, 'KIA', 'Sportage', 2022, 'Red', 'JKL-012', 5, 1, '2026-08-05'),
(9, 'Toyota', 'Yaris', 2021, 'White', 'MNO-345', 4, 1, '2026-11-11'),
(1, 'Honda', 'City', 2019, 'Grey', 'PQR-678', 4, 1, '2026-09-30'),
(3, 'Suzuki', 'Alto', 2021, 'White', 'STU-901', 4, 1, '2027-02-28'),
(5, 'Hyundai', 'Tucson', 2023, 'Black', 'VWX-234', 5, 1, '2026-07-12'),
(7, 'Toyota', 'Prius', 2017, 'Blue', 'YZA-567', 4, 1, '2026-05-15'),
(9, 'Suzuki', 'Swift', 2022, 'Red', 'BCD-890', 4, 1, '2026-12-01');
GO

-- 3. RIDES
INSERT INTO Rides (DriverID, VehicleID, Source, Destination, DepartureTime, AvailableSeats, PricePerSeat, Status) VALUES 
(1, 1, 'DHA', 'LUMS', '2026-05-01 08:00:00', 3, 300.00, 'Active'),
(3, 2, 'Johar Town', 'Gulberg', '2026-05-02 09:00:00', 2, 400.00, 'Active'),
(5, 3, 'Bahria Town', 'Model Town', '2026-05-03 07:30:00', 3, 500.00, 'Completed'),
(7, 4, 'Cantt', 'DHA', '2026-05-04 17:00:00', 4, 350.00, 'Active'),
(9, 5, 'Wapda Town', 'Cantt', '2026-05-05 18:00:00', 2, 450.00, 'In Progress'),
(1, 6, 'LUMS', 'Johar Town', '2026-05-06 14:30:00', 3, 250.00, 'Cancelled'),
(3, 7, 'Gulberg', 'Bahria Town', '2026-05-07 15:00:00', 3, 300.00, 'Active'),
(5, 8, 'Model Town', 'Wapda Town', '2026-05-08 19:00:00', 4, 500.00, 'Active'),
(7, 9, 'DHA', 'Cantt', '2026-05-09 13:00:00', 1, 200.00, 'Active'),
(9, 10, 'Iqbal Town', 'LUMS', '2026-05-10 10:00:00', 2, 300.00, 'Active');
GO

-- 4. BOOKINGS
INSERT INTO Bookings (RideID, PassengerID, SeatsBooked, TotalFare, Status) VALUES 
(1, 2, 1, 300.00, 'Confirmed'),
(1, 4, 1, 300.00, 'Confirmed'),
(2, 6, 2, 800.00, 'Confirmed'),
(3, 8, 1, 500.00, 'Completed'),
(4, 10, 1, 350.00, 'Confirmed'),
(5, 2, 2, 900.00, 'Confirmed'),
(6, 4, 1, 250.00, 'Cancelled'),
(8, 6, 1, 500.00, 'Confirmed'),
(9, 8, 1, 200.00, 'No Show'),
(10, 10, 2, 600.00, 'Confirmed');
GO

-- 5. PAYMENTS
INSERT INTO Payments (BookingID, Amount, PaymentMethod, TransactionStatus, TransactionID) VALUES 
(1, 300.00, 'JazzCash', 'Completed', 'TXN001'),
(2, 300.00, 'EasyPaisa', 'Pending', 'TXN002'),
(3, 800.00, 'Credit Card', 'Completed', 'TXN003'),
(4, 500.00, 'Cash', 'Completed', NULL),
(5, 350.00, 'In-App Wallet', 'Completed', 'TXN005'),
(6, 900.00, 'Debit Card', 'Completed', 'TXN006'),
(7, 250.00, 'JazzCash', 'Refunded', 'TXN007'),
(8, 500.00, 'Credit Card', 'Pending', 'TXN008'),
(9, 200.00, 'EasyPaisa', 'Failed', 'TXN009'),
(10, 600.00, 'In-App Wallet', 'Completed', 'TXN010');
GO

-- 6. REVIEWS
INSERT INTO Reviews (ReviewerID, RevieweeID, RideID, Rating, Comment) VALUES 
(2, 1, 1, 5.0, 'Great driver!'),
(4, 1, 1, 4.5, 'Smooth ride.'),
(6, 3, 2, 4.0, 'A bit late but safe.'),
(8, 5, 3, 5.0, 'Car was clean.'),
(10, 7, 4, 3.5, 'Music was loud.'),
(1, 2, 1, 5.0, 'Polite passenger.'),
(3, 6, 2, 4.0, 'Good communication.'),
(5, 8, 3, 5.0, 'Ready on time.'),
(7, 10, 4, 4.5, 'Pleasant trip.'),
(4, 9, 5, 5.0, 'Highly recommend.');
GO

-- 7. ROUTES
INSERT INTO Routes (RideID, WaypointOrder, Location, EstimatedArrival) VALUES 
(1, 1, 'DHA Phase 5 Gate', '2026-05-01 08:00:00'),
(1, 2, 'Walton Road', '2026-05-01 08:15:00'),
(1, 3, 'LUMS', '2026-05-01 08:30:00'),
(2, 1, 'Johar Town G Block', '2026-05-02 09:00:00'),
(2, 2, 'Ferozepur Road', '2026-05-02 09:20:00'),
(2, 3, 'Gulberg Main', '2026-05-02 09:40:00'),
(3, 1, 'Bahria Town Gate', '2026-05-03 07:30:00'),
(3, 2, 'Thokar Niaz Baig', '2026-05-03 07:50:00'),
(3, 3, 'Model Town Park', '2026-05-03 08:20:00'),
(4, 1, 'Cantt Station', '2026-05-04 17:00:00');
GO

-- 8. PREFERENCES
INSERT INTO Preferences (UserID, PrefersSameGender, MusicPreference, ConversationPreference, SmokingAllowed, PetFriendly) VALUES 
(1, 0, 'Pop', 'Chatty', 0, 0),
(2, 1, 'Silence', 'Quiet', 0, 0),
(3, 0, 'Rock', 'Professional', 1, 0),
(4, 1, 'Any', 'Chatty', 0, 1),
(5, 0, 'Classical', 'Quiet', 0, 0),
(6, 1, 'Pop', 'Chatty', 0, 0),
(7, 0, 'Any', 'Professional', 1, 1),
(8, 1, 'Silence', 'Quiet', 0, 0),
(9, 0, 'Rock', 'Chatty', 0, 0),
(10, 0, 'Classical', 'Professional', 0, 1);
GO

-- 9. NOTIFICATIONS
INSERT INTO Notifications (UserID, Type, Message, IsRead) VALUES 
(2, 'Booking', 'Ride confirmed.', 1),
(4, 'Booking', 'Ride confirmed.', 0),
(1, 'RideUpdate', 'Passenger ready.', 1),
(6, 'Payment', 'Payment successful.', 0),
(8, 'Booking', 'Ride completed.', 1),
(3, 'System', 'Welcome to app.', 1),
(5, 'Payment', 'Payout sent.', 1),
(10, 'RideUpdate', 'Driver arriving soon.', 0),
(7, 'System', 'Update app.', 0),
(9, 'Booking', 'New request.', 1);
GO






-- 10. EMERGENCY CONTACTS
INSERT INTO EmergencyContacts (UserID, Name, Phone, Relationship, IsPrimary) VALUES 
(1, 'Ali Baba', '03111111111', 'Father', 1),
(2, 'Sana Khan', '03122222222', 'Sister', 1),
(3, 'Hamza Tariq', '03133333333', 'Brother', 1),
(4, 'Raza Ali', '03144444444', 'Husband', 1),
(5, 'Zara Malik', '03155555555', 'Wife', 1),
(6, 'Noor Ahmed', '03166666666', 'Mother', 1),
(7, 'Shahid Ahmed', '03177777777', 'Father', 1),
(8, 'Gul Zafar', '03188888888', 'Sister', 1),
(9, 'Farooq Azam', '03199999999', 'Father', 1),
(10, 'Shahid Shah', '03200000000', 'Brother', 1);
GO

-- 11. CARPOOL GROUPS
INSERT INTO CarpoolGroups (Name, Description, CreatedBy, SchedulePattern, IsActive) VALUES 
('LUMS Commuters', 'Daily LUMS trips', 1, 'Mon-Fri', 1),
('Tech Park', 'To Arfa Tower', 3, 'Mon-Fri', 1),
('Bahria Office', 'Office commute', 5, 'Mon-Sat', 1),
('Weekend Fun', 'Casual trips', 7, 'Sat-Sun', 1),
('Cantt Area', 'Cantt residents', 9, 'Flexible', 1),
('Model Towners', 'Model town to DHA', 1, 'Mon-Fri', 1),
('Faisal Towners', 'Uni rides', 3, 'Mon-Thu', 1),
('Wapda Commute', 'Daily routes', 5, 'Weekdays', 1),
('Iqbal Riders', 'Evening rides', 7, 'Weekends', 0),
('Mall Roaders', 'Professionals', 9, 'Mon-Fri', 1);
GO

-- 12. GROUP MEMBERSHIPS
INSERT INTO GroupMemberships (GroupID, UserID, Role) VALUES 
(1, 1, 'Admin'),
(1, 2, 'Member'),
(2, 3, 'Admin'),
(2, 4, 'Member'),
(3, 5, 'Admin'),
(3, 6, 'Member'),
(4, 7, 'Admin'),
(4, 8, 'Member'),
(5, 9, 'Admin'),
(5, 10, 'Member');
GO

-- 13. REPORTS
INSERT INTO Reports (ReporterID, ReportedUserID, RideID, Reason, Status, ResolvedBy) VALUES 
(2, 1, 1, 'Drove fast.', 'Pending', NULL),
(6, 3, 2, 'AC broke.', 'Reviewed', NULL),
(10, 7, 4, 'Rude behavior.', 'Resolved', 1),
(1, 2, 1, 'Late 15 mins.', 'Dismissed', 3),
(8, 5, 3, 'Bad driving.', 'Pending', NULL),
(4, 9, 5, 'Wrong dropoff.', 'Resolved', 5),
(3, 6, 2, 'Argued fare.', 'Pending', NULL),
(7, 10, 4, 'Spilled drink.', 'Resolved', 1),
(5, 8, 3, 'Fake pic.', 'Reviewed', NULL),
(9, 2, 6, 'No show.', 'Resolved', 7);
GO

-- 14. FARE CALCULATIONS
INSERT INTO FareCalculations (RideID, BaseFare, DistanceCharge, TimeCharge, SurgeMultiplier, TotalFare) VALUES 
(1, 100.00, 150.00, 50.00, 1.0, 300.00),
(2, 150.00, 200.00, 50.00, 1.0, 400.00),
(3, 150.00, 250.00, 100.00, 1.0, 500.00),
(4, 100.00, 200.00, 50.00, 1.0, 350.00),
(5, 120.00, 250.00, 80.00, 1.0, 450.00),
(6, 100.00, 100.00, 50.00, 1.0, 250.00),
(7, 100.00, 150.00, 50.00, 1.0, 300.00),
(8, 150.00, 250.00, 100.00, 1.0, 500.00),
(9, 80.00, 100.00, 20.00, 1.0, 200.00),
(10, 100.00, 150.00, 50.00, 1.0, 300.00);
GO


-------------------------------------------------------------------------
-- PHASE 2: IMPLEMENTATION OF FUNCTIONS
-------------------------------------------------------------------------

-- 2. DELETE
-- Implementing DELETE on Notifications table to remove all read notifications.
DELETE FROM Notifications
WHERE IsRead = 1;
GO

-- 3. UPDATE
-- Implementing UPDATE on Vehicles table to change the color of a specific vehicle.
UPDATE Vehicles
SET Color = 'Midnight Blue'
WHERE LicensePlate = 'ABC-123';
GO

-- 4. SELECT
-- Implementing SELECT on CarpoolGroups table to view all group records.
SELECT * FROM CarpoolGroups;
GO

-- 5. WHERE
-- Implementing WHERE on Rides table to filter and show only currently active rides.
SELECT RideID, Source, Destination, DepartureTime 
FROM Rides 
WHERE Status = 'Active';
GO

-- 6. LIKE
-- Implementing LIKE on Users table to find users who signed up with an example.com email.
SELECT Name, Email 
FROM Users 
WHERE Email LIKE '%@example.com%';
GO

-- 7. HAVING
-- Implementing HAVING on Bookings table to filter grouped data and only show rides with more than 1 booking.
SELECT RideID, COUNT(BookingID) AS TotalBookings
FROM Bookings
GROUP BY RideID
HAVING COUNT(BookingID) > 1;
GO

-- 8. UNION
-- Implementing UNION on Users table to combine driver and passenger emails into a single list.
SELECT Email FROM Users WHERE Role = 'Driver'
UNION
SELECT Email FROM Users WHERE Role = 'Passenger';
GO

-- 9. INTERSECTION
-- Implementing INTERSECT on Users and GroupMemberships tables to find drivers who are also group admins.
SELECT UserID FROM Users WHERE Role IN ('Driver', 'Both')
INTERSECT
SELECT UserID FROM GroupMemberships WHERE Role = 'Admin';
GO

-- 10. EXCEPT
-- Implementing EXCEPT on Users and Bookings tables to find registered users who have never booked a ride.
SELECT UserID FROM Users
EXCEPT
SELECT PassengerID FROM Bookings;
GO

-- 11. Aggregate Function (COUNT / AVG / MIN / MAX / SUM)
-- Implementing SUM and COUNT on Bookings table to calculate the total revenue and total number of successful bookings.
SELECT SUM(TotalFare) AS TotalRevenue, 
COUNT(BookingID) AS TotalBookedRides
FROM Bookings
WHERE Status = 'Confirmed';
GO

-- 12. GROUP BY
-- Implementing GROUP BY on Bookings table to calculate how many total seats are booked for each specific ride.
SELECT RideID, SUM(SeatsBooked) AS SeatsBookedPerRide
FROM Bookings
GROUP BY RideID;
GO

-- 13. ORDER BY
-- Implementing ORDER BY on Users table to display the highest-rated users at the top of the list.
SELECT Name, Rating, Role 
FROM Users 
ORDER BY Rating DESC;
GO

-- 14. JOIN
-- Implementing INNER JOIN on Rides and Vehicles tables to see the car details assigned to each ride.
SELECT r.Source, r.Destination, v.Make, v.Model 
FROM Rides r
JOIN Vehicles v ON r.VehicleID = v.VehicleID;
GO

-- 15. LEFT JOIN
-- Implementing LEFT JOIN on Users and Preferences tables to list all users alongside their music preferences.
SELECT u.Name, p.MusicPreference 
FROM Users u
LEFT JOIN Preferences p ON u.UserID = p.UserID;
GO

-- 16. RIGHT JOIN
-- Implementing RIGHT JOIN on Users and Vehicles tables to display all registered vehicles and match them with their owner's name.
SELECT v.LicensePlate, v.Make, u.Name AS OwnerName 
FROM Users u
RIGHT JOIN Vehicles v ON u.UserID = v.OwnerID;
GO

-- 17. OUTER JOIN
-- Implementing FULL OUTER JOIN on Bookings and Payments tables to audit all bookings and payments.
SELECT b.BookingID, b.TotalFare, p.PaymentID, p.Amount 
FROM Bookings b
FULL OUTER JOIN Payments p ON b.BookingID = p.BookingID;
GO

-- 18. Subqueries / Nested Queries
-- Implementing a Subquery on Users and Bookings tables to fetch the contact details of passengers marked as a 'No Show'.
SELECT Name, Phone 
FROM Users 
WHERE UserID IN (
    SELECT PassengerID 
    FROM Bookings 
    WHERE Status = 'No Show'
);
GO