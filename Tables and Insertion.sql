USE project1;

CREATE TABLE USERS (
    UserId INT PRIMARY KEY AUTO_INCREMENT,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    FName VARCHAR(10) NOT NULL,
    MInit VARCHAR(10),
    LName VARCHAR(10),
    Role ENUM('Student', 'Teacher', 'Admin') NOT NULL,
    Phone VARCHAR(10),
    State VARCHAR(20),
    City VARCHAR(20),
    PinCode VARCHAR(6),
    DOB DATE NOT NULL
);

CREATE TABLE CLASS (
    ClassId INT PRIMARY KEY AUTO_INCREMENT,
    Sem INT NOT NULL,
    Branch VARCHAR(50) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Degree VARCHAR(50) NOT NULL
);

CREATE TABLE COURSE (
    CourseCode VARCHAR(20) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Credits INT NOT NULL,
    DeptName VARCHAR(50) NOT NULL
);

CREATE TABLE TEACHER (
    UserId INT PRIMARY KEY,
    Salary DECIMAL(10,2),
    SSN VARCHAR(20) UNIQUE,
    Department VARCHAR(50),
    FOREIGN KEY (UserId) REFERENCES USERS(UserId) ON DELETE CASCADE
);

CREATE TABLE STUDENT (
    UserId INT PRIMARY KEY,
    CurrentClassId INT,
    FOREIGN KEY (UserId) REFERENCES USERS(UserId) ON DELETE CASCADE,
    FOREIGN KEY (CurrentClassId) REFERENCES CLASS(ClassId) ON DELETE SET NULL
);

CREATE TABLE LECTURE (
    LectureId INT PRIMARY KEY AUTO_INCREMENT,
    Date DATE NOT NULL,
    Time TIME NOT NULL,
    Duration INT NOT NULL,
    Topic VARCHAR(255) NOT NULL,
    RoomNo VARCHAR(20),
    MeetLink VARCHAR(100),
    CourseId VARCHAR(20),
    ClassId INT,
    FOREIGN KEY (CourseId) REFERENCES COURSE(CourseCode) ON DELETE CASCADE,
    FOREIGN KEY (ClassId) REFERENCES CLASS(ClassId) ON DELETE CASCADE
);

CREATE TABLE ATTENDANCE (
    Status ENUM('Present', 'Absent', 'Partial') NOT NULL,
    StudentId INT,
    LectureId INT,
    PRIMARY KEY (StudentId, LectureId),
    FOREIGN KEY (StudentId) REFERENCES USERS(UserId) ON DELETE CASCADE,
    FOREIGN KEY (LectureId) REFERENCES LECTURE(LectureId) ON DELETE CASCADE
);

CREATE TABLE REPORT (
    SEEMarks INT,
    CIEMarks INT,
    Grade CHAR(2),
    Remark VARCHAR(255),
    CourseId VARCHAR(20),
    ClassId INT,
    StudentId INT,
    PRIMARY KEY (CourseId, ClassId, StudentId),
    FOREIGN KEY (CourseId) REFERENCES COURSE(CourseCode) ON DELETE CASCADE,
    FOREIGN KEY (ClassId) REFERENCES CLASS(ClassId) ON DELETE CASCADE,
    FOREIGN KEY (StudentId) REFERENCES USERS(UserId) ON DELETE CASCADE
);

CREATE TABLE ASSIGNMENT (
    AssignmentId INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    GivenOn DATE NOT NULL,
    Deadline DATE NOT NULL,
    ClassId INT,
    CourseId VARCHAR(20),
    FOREIGN KEY (ClassId) REFERENCES CLASS(ClassId) ON DELETE CASCADE,
    FOREIGN KEY (CourseId) REFERENCES COURSE(CourseCode) ON DELETE CASCADE
);

CREATE TABLE CURRICULUM (
    ClassId INT,
    CourseId VARCHAR(20),
    AssignedTeacherId INT,
    PRIMARY KEY (ClassId, CourseId),
    FOREIGN KEY (ClassId) REFERENCES CLASS(ClassId) ON DELETE CASCADE,
    FOREIGN KEY (CourseId) REFERENCES COURSE(CourseCode) ON DELETE CASCADE,
    FOREIGN KEY (AssignedTeacherId) REFERENCES USERS(UserId) ON UPDATE CASCADE
);

INSERT INTO USERS (Email, Password, FName, MInit, LName, Role, Phone, State, City, PinCode, DOB) VALUES
('rahul.sharma@gmail.com', 'pass123', 'Rahul', 'K', 'Sharma', 'Student', '9876543210', 'Maharashtra', 'Pune', '411001', '2003-05-14'),
('priya.patil@gmail.com', 'pass123', 'Priya', 'S', 'Patil', 'Student', '9867543210', 'Karnataka', 'Belagavi', '590001', '2002-11-21'),
('ravi.kumar@gmail.com', 'pass123', 'Ravi', 'R', 'Kumar', 'Teacher', '9823456789', 'Delhi', 'New Delhi', '110001', '1980-07-10'),
('sneha.nair@gmail.com', 'pass123', 'Sneha', 'M', 'Nair', 'Teacher', '9812345678', 'Kerala', 'Kochi', '682001', '1985-09-05'),
('admin.college@gmail.com', 'admin123', 'Admin', NULL, 'User', 'Admin', '9999999999', 'Maharashtra', 'Mumbai', '400001', '1975-01-01'),
('akash.verma@gmail.com', 'pass123', 'Akash', 'P', 'Verma', 'Student', '9898123456', 'Uttar Pradesh', 'Lucknow', '226001', '2003-09-12'),
('divya.iyer@gmail.com', 'pass123', 'Divya', 'L', 'Iyer', 'Teacher', '9845012345', 'Tamil Nadu', 'Chennai', '600001', '1983-03-18'),
('nisha.kapoor@gmail.com', 'pass123', 'Nisha', 'R', 'Kapoor', 'Student', '9876001122', 'Haryana', 'Gurugram', '122001', '2004-02-09'),
('arjun.singh@gmail.com', 'pass123', 'Arjun', 'M', 'Singh', 'Student', '9988776655', 'Punjab', 'Ludhiana', '141001', '2003-07-23'),
('manoj.reddy@gmail.com', 'pass123', 'Manoj', 'K', 'Reddy', 'Teacher', '9900887766', 'Telangana', 'Hyderabad', '500001', '1979-12-15');

INSERT INTO CLASS (Sem, Branch, StartDate, EndDate, Degree) VALUES
(1, 'Computer Science', '2025-07-01', '2026-05-31', 'B.Tech'),
(2, 'Computer Science', '2024-07-01', '2025-05-31', 'B.Tech'),
(3, 'Electronics', '2025-07-01', '2026-05-31', 'B.Tech'),
(4, 'Mechanical', '2025-07-01', '2026-05-31', 'Diploma'),
(5, 'Civil', '2025-07-01', '2026-05-31', 'B.Tech'),
(6, 'Information Technology', '2025-07-01', '2026-05-31', 'B.Tech'),
(7, 'Electrical', '2025-07-01', '2026-05-31', 'B.Tech'),
(8, 'Electronics', '2024-07-01', '2025-05-31', 'B.Tech'),
(9, 'Computer Science', '2023-07-01', '2024-05-31', 'B.Tech'),
(10, 'Mechanical', '2024-07-01', '2025-05-31', 'Diploma');

INSERT INTO TEACHER (UserId, Salary, SSN, Department) VALUES
(3, 65000.00, 'TCH12345', 'Computer Science'),
(4, 70000.00, 'TCH54321', 'Electronics'),
(7, 72000.00, 'TCH67890', 'Information Technology'),
(10, 75000.00, 'TCH11111', 'Mechanical');

INSERT INTO STUDENT (UserId, CurrentClassId) VALUES
(1, 1),
(2, 3),
(6, 1),
(8, 2),
(9, 3);

INSERT INTO COURSE (CourseCode, Name, Credits, DeptName) VALUES
('CSE101', 'Data Structures', 4, 'Computer Science'),
('CSE102', 'Database Management Systems', 4, 'Computer Science'),
('CSE103', 'Operating Systems', 4, 'Computer Science'),
('CSE104', 'Computer Networks', 4, 'Computer Science'),
('CSE105', 'Software Engineering', 3, 'Computer Science'),
('ECE101', 'Digital Electronics', 4, 'Electronics'),
('MECH101', 'Engineering Mechanics', 4, 'Mechanical'),
('IT101', 'Web Technologies', 3, 'Information Technology'),
('EEE101', 'Electrical Circuits', 4, 'Electrical'),
('CIV101', 'Structural Engineering', 4, 'Civil');

INSERT INTO LECTURE (Date, Time, Duration, Topic, RoomNo, MeetLink, CourseId, ClassId) VALUES
('2025-10-05', '10:00:00', 60, 'Introduction to Data Structures', 'CSE101', 'https://meet.google.com/abc-123', 'CSE101', 1),
('2025-10-06', '11:30:00', 60, 'Normalization in DBMS', 'CSE102', 'https://meet.google.com/def-456', 'CSE102', 1),
('2025-10-07', '09:30:00', 60, 'Combinational Circuits', 'ECE101', 'https://meet.google.com/ghi-789', 'ECE101', 3),
('2025-10-08', '10:00:00', 60, 'Mechanics Laws', 'MECH101', 'https://meet.google.com/jkl-111', 'MECH101', 4),
('2025-10-09', '09:30:00', 60, 'HTML Basics', 'IT101', 'https://meet.google.com/mno-222', 'IT101', 6),
('2025-10-10', '08:30:00', 60, 'Circuit Components', 'EEE101', 'https://meet.google.com/pqr-333', 'EEE101', 7),
('2025-10-11', '09:30:00', 60, 'Threads and Processes', 'CSE103', 'https://meet.google.com/stu-444', 'CSE103', 2),
('2025-10-12', '11:00:00', 60, 'Routing Protocols', 'CSE104', 'https://meet.google.com/vwx-555', 'CSE104', 1),
('2025-10-13', '10:00:00', 60, 'SDLC Models', 'CSE105', 'https://meet.google.com/yz-666', 'CSE105', 1),
('2025-10-14', '09:00:00', 60, 'Bridge Design Concepts', 'CIV101', 'https://meet.google.com/aaa-777', 'CIV101', 5);

INSERT INTO ATTENDANCE (Status, StudentId, LectureId) VALUES
('Present', 1, 31),
('Absent', 2, 32),
('Present', 6, 33),
('Partial', 1, 34),
('Present', 2, 35),
('Absent', 8, 36),
('Present', 9, 37),
('Present', 1, 38),
('Partial', 6, 39),
('Present', 2, 40);

INSERT INTO REPORT (SEEMarks, CIEMarks, Grade, Remark, CourseId, ClassId, StudentId) VALUES
(72, 24, 'A', 'Good performance', 'CSE101', 1, 1),
(65, 20, 'B', 'Needs improvement', 'CSE102', 1, 2),
(88, 25, 'A+', 'Excellent', 'ECE101', 3, 9),
(55, 18, 'C', 'Work harder', 'MECH101', 4, 6),
(90, 27, 'A+', 'Outstanding', 'IT101', 6, 8),
(80, 25, 'A', 'Very good', 'EEE101', 7, 9),
(78, 23, 'A', 'Consistent', 'CSE103', 2, 1),
(84, 26, 'A+', 'Excellent', 'CSE104', 1, 2),
(60, 19, 'B', 'Average', 'CSE105', 1, 6),
(70, 22, 'A', 'Good', 'CIV101', 5, 9);

INSERT INTO ASSIGNMENT (Title, Description, GivenOn, Deadline, ClassId, CourseId) VALUES
('Linked List Implementation', 'C program for linked list', '2025-10-01', '2025-10-10', 1, 'CSE101'),
('ER Diagram for College DB', 'Create ER diagram', '2025-10-03', '2025-10-12', 1, 'CSE102'),
('Logic Gate Simulation', 'Digital circuits using Logisim', '2025-10-04', '2025-10-11', 3, 'ECE101'),
('Force Analysis', 'Solve problems on equilibrium', '2025-10-02', '2025-10-09', 4, 'MECH101'),
('Bridge Design', 'Basic bridge structure', '2025-10-06', '2025-10-14', 5, 'CIV101'),
('Web Page Design', 'Create HTML/CSS portfolio', '2025-10-05', '2025-10-13', 6, 'IT101'),
('Circuit Diagram', 'Draw basic circuit connections', '2025-10-04', '2025-10-11', 7, 'EEE101'),
('Thread Management', 'Implement threading in C', '2025-10-03', '2025-10-10', 2, 'CSE103'),
('Network Layers', 'Write notes on OSI layers', '2025-10-02', '2025-10-09', 1, 'CSE104'),
('SDLC Documentation', 'Explain waterfall model', '2025-10-01', '2025-10-10', 1, 'CSE105');

INSERT INTO CURRICULUM (ClassId, CourseId, AssignedTeacherId) VALUES
(1, 'CSE101', 3),
(1, 'CSE102', 3),
(2, 'CSE103', 3),
(1, 'CSE104', 4),
(1, 'CSE105', 7),
(3, 'ECE101', 4),
(4, 'MECH101', 10),
(5, 'CIV101', 10),
(6, 'IT101', 7),
(7, 'EEE101', 4);
