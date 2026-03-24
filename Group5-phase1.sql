
-- 1.Users Table
CREATE TABLE Users 
(
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(50) NOT NULL,
    Email VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Phone VARCHAR(20) NOT NULL,
    Role VARCHAR(20) NOT NULL CHECK (Role IN ('Driver', 'Passenger', 'Both')),
    Gender CHAR(1) CHECK (Gender IN ('M', 'F', 'O')),
    Rating DECIMAL(3,2) DEFAULT 0.00 CHECK (Rating BETWEEN 0 AND 5),
    IsVerified BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- 2. Vehicles Table
CREATE TABLE Vehicles (
    VehicleID INT PRIMARY KEY IDENTITY(1,1),
    OwnerID INT NOT NULL,
    Make NVARCHAR(50) NOT NULL,       
    Model NVARCHAR(50) NOT NULL,      
    Year INT CHECK (Year >= 1990 AND Year <= YEAR(GETDATE()) + 1),
    Color NVARCHAR(30),
    LicensePlate NVARCHAR(20) UNIQUE NOT NULL, 
    Capacity INT CHECK (Capacity > 0), -- Total seats including driver
    AC_Available BIT DEFAULT 1,        -- 1 = Yes, 0 = No
    InsuranceExpiry DATETIME,
    CreatedAt DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (OwnerID) REFERENCES Users(UserID)
        ON DELETE NO ACTION 
        ON UPDATE NO ACTION
);

-- 3.Rides Table
CREATE TABLE Rides 
(
    RideID INT PRIMARY KEY IDENTITY(1,1),
    DriverID INT NOT NULL,
    VehicleID INT NOT NULL,
    Source VARCHAR(200) NOT NULL,
    Destination VARCHAR(200) NOT NULL,
    DepartureTime DATETIME NOT NULL CHECK (DepartureTime > GETDATE()),
    AvailableSeats INT NOT NULL CHECK (AvailableSeats >= 0),
    PricePerSeat DECIMAL(10,2) NOT NULL CHECK (PricePerSeat >= 0),
    Status VARCHAR(20) DEFAULT 'Active' 
        CHECK (Status IN ('Active', 'Completed', 'Cancelled', 'In Progress')),
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (DriverID) REFERENCES Users(UserID) 
        ON DELETE NO ACTION
        ON UPDATE CASCADE,
    FOREIGN KEY (VehicleID) REFERENCES Vehicles(VehicleID) 
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

-- 4.Bookings Table
CREATE TABLE Bookings 
(
    BookingID INT PRIMARY KEY IDENTITY(1,1),
    RideID INT NOT NULL,
    PassengerID INT NOT NULL,
    SeatsBooked INT NOT NULL CHECK (SeatsBooked > 0),
    TotalFare DECIMAL(10,2) NOT NULL CHECK (TotalFare >= 0),
    BookingTime DATETIME DEFAULT GETDATE(),
    Status VARCHAR(20) DEFAULT 'Confirmed' 
        CHECK (Status IN ('Confirmed', 'Cancelled', 'Completed', 'No Show')),
    FOREIGN KEY (RideID) REFERENCES Rides(RideID) 
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    FOREIGN KEY (PassengerID) REFERENCES Users(UserID) 
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);


-- 5.Payments Table
CREATE TABLE Payments 
(
    PaymentID INT PRIMARY KEY IDENTITY(1,1),
    BookingID INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL CHECK (Amount > 0),
    PaymentMethod VARCHAR(50) NOT NULL 
        CHECK (PaymentMethod IN ('Cash', 'Credit Card', 'Debit Card', 'JazzCash', 'EasyPaisa', 'In-App Wallet')),
    TransactionStatus VARCHAR(20) NOT NULL DEFAULT 'Pending'
        CHECK (TransactionStatus IN ('Pending', 'Completed', 'Failed', 'Refunded', 'Cancelled')),
    TransactionID VARCHAR(100) UNIQUE,
    Timestamp DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (BookingID) REFERENCES Bookings(BookingID) 
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);


-- 6. Reviews Table
CREATE TABLE Reviews (
    ReviewID INT PRIMARY KEY IDENTITY(1,1),
    ReviewerID INT NOT NULL, -- Who wrote the review
    RevieweeID INT NOT NULL, -- Who received the review
    RideID INT NOT NULL,     -- Which ride this is about
    Rating DECIMAL(2, 1) CHECK (Rating >= 1.0 AND Rating <= 5.0),
    Comment NVARCHAR(MAX),   -- MAX allows strictly long text
    Timestamp DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (ReviewerID) REFERENCES Users(UserID) ON DELETE NO ACTION,
    FOREIGN KEY (RevieweeID) REFERENCES Users(UserID) ON DELETE NO ACTION,
    FOREIGN KEY (RideID) REFERENCES Rides(RideID) ON DELETE NO ACTION
);

-- 7. Routes Table
CREATE TABLE Routes 
(
    RouteID INT PRIMARY KEY IDENTITY(1,1),
    RideID INT NOT NULL,
    WaypointOrder INT NOT NULL, -- Defines the sequence (1 = start, 2 = first stop, etc.)
    Location NVARCHAR(255) NOT NULL,
    EstimatedArrival DATETIME,
    
    FOREIGN KEY (RideID) REFERENCES Rides(RideID)
        ON DELETE CASCADE -- If Ride is deleted, its route points must be deleted
        ON UPDATE CASCADE
);


-- 8. Preferences Table
CREATE TABLE Preferences 
(
    PreferenceID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT UNIQUE NOT NULL,        -- UNIQUE constraint ensures 1-to-1 relation
    PrefersSameGender BIT DEFAULT 0,
    MusicPreference NVARCHAR(50) CHECK (MusicPreference IN ('Any', 'Pop', 'Rock', 'Classical', 'Silence')),
    ConversationPreference NVARCHAR(50) CHECK (ConversationPreference IN ('Chatty', 'Quiet', 'Professional')),
    SmokingAllowed BIT DEFAULT 0,
    PetFriendly BIT DEFAULT 0,
    
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
        ON DELETE CASCADE -- If User is deleted, their preferences should vanish
        ON UPDATE CASCADE
);

-- 9. Notifications Table
CREATE TABLE Notifications 
(
    NotificationID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    Type NVARCHAR(50) CHECK (Type IN ('Booking', 'Payment', 'RideUpdate', 'System')),
    Message NVARCHAR(255) NOT NULL,
    IsRead BIT DEFAULT 0, -- 0 = Unread, 1 = Read
    CreatedAt DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- 10. EmergencyContacts Table
CREATE TABLE EmergencyContacts 
(
    ContactID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Phone NVARCHAR(20) NOT NULL,
    Relationship NVARCHAR(50),
    IsPrimary BIT DEFAULT 0,
    
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
        ON DELETE CASCADE -- If User is deleted, contacts are irrelevant
        ON UPDATE CASCADE
);

-->. First, drop tables in reverse order
-- Drop dependent table first to avoid foreign key conflicts
DROP TABLE IF EXISTS GroupMemberships;
DROP TABLE IF EXISTS CarpoolGroups;

--11.CarpoolGroups Table
CREATE TABLE CarpoolGroups 
(
    GroupID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    SchedulePattern NVARCHAR(50),
    IsActive BIT DEFAULT 1,
    
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION  
);

--12.GroupMemberships Table 
CREATE TABLE GroupMemberships 
(
    MembershipID INT PRIMARY KEY IDENTITY(1,1),
    GroupID INT NOT NULL,
    UserID INT NOT NULL,
    JoinedAt DATETIME DEFAULT GETDATE(),
    Role NVARCHAR(20) DEFAULT 'Member' CHECK (Role IN ('Member', 'Admin', 'Moderator')),
    
    FOREIGN KEY (GroupID) REFERENCES CarpoolGroups(GroupID)
        ON DELETE NO ACTION
        ON UPDATE CASCADE,
    
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
        ON DELETE NO ACTION
        ON UPDATE CASCADE,
    
    CONSTRAINT UQ_GroupUser UNIQUE (GroupID, UserID)
);


--13. Reports Table 
CREATE TABLE Reports 
(
    ReportID INT PRIMARY KEY IDENTITY(1,1),
    ReporterID INT NOT NULL,
    ReportedUserID INT NOT NULL,
    RideID INT,                                        
    Reason NVARCHAR(MAX) NOT NULL,
    Status NVARCHAR(20) DEFAULT 'Pending'         
        CHECK (Status IN ('Pending', 'Reviewed', 'Resolved', 'Dismissed')),
    ResolvedBy INT,                                   
    ResolvedAt DATETIME,
    CreatedAt DATETIME DEFAULT GETDATE(),             
    
    FOREIGN KEY (ReporterID) REFERENCES Users(UserID)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    
    FOREIGN KEY (ReportedUserID) REFERENCES Users(UserID)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    
    FOREIGN KEY (RideID) REFERENCES Rides(RideID)
        ON DELETE SET NULL                             
        ON UPDATE CASCADE,
    
    FOREIGN KEY (ResolvedBy) REFERENCES Users(UserID)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    
    CHECK (ReporterID != ReportedUserID)               
);


--14. FareCalculations Table 
CREATE TABLE FareCalculations 
(
    FareID INT PRIMARY KEY IDENTITY(1,1),
    RideID INT UNIQUE NOT NULL,                    
    BaseFare DECIMAL(10,2) NOT NULL CHECK (BaseFare >= 0),
    DistanceCharge DECIMAL(10,2) CHECK (DistanceCharge >= 0),
    TimeCharge DECIMAL(10,2) CHECK (TimeCharge >= 0),
    SurgeMultiplier DECIMAL(3,2) DEFAULT 1.0 
        CHECK (SurgeMultiplier >= 1.0),                  -- Surge can't be less than 1
    TotalFare DECIMAL(10,2) NOT NULL CHECK (TotalFare >= 0),
    CalculatedAt DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (RideID) REFERENCES Rides(RideID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
