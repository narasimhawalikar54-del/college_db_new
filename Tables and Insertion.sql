USE project1;

CREATE TABLE USERS (
    UserId INT PRIMARY KEY AUTO_INCREMENT,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    FName VARCHAR(50) NOT NULL,
    MInit VARCHAR(10),
    LName VARCHAR(50) NOT NULL,
    Role ENUM('Student', 'Teacher', 'Admin') NOT NULL,
    Phone VARCHAR(15) NOT NULL,
    State VARCHAR(50) NOT NULL,
    City VARCHAR(50) NOT NULL,
    PinCode VARCHAR(10) NOT NULL,
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
    Salary DECIMAL(10,2) NOT NULL,
    SSN VARCHAR(20) UNIQUE NOT NULL,
    Department VARCHAR(50) NOT NULL,
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
    RoomNo VARCHAR(20) NOT NULL,
    MeetLink VARCHAR(255),
    CourseId VARCHAR(20) NOT NULL,
    ClassId INT NOT NULL,
    FOREIGN KEY (CourseId) REFERENCES COURSE(CourseCode) ON DELETE CASCADE,
    FOREIGN KEY (ClassId) REFERENCES CLASS(ClassId) ON DELETE CASCADE
);

CREATE TABLE ATTENDANCE (
    Status ENUM('Present', 'Absent', 'Partial') NOT NULL,
    StudentId INT NOT NULL,
    LectureId INT NOT NULL,
    PRIMARY KEY (StudentId, LectureId),
    FOREIGN KEY (StudentId) REFERENCES USERS(UserId) ON DELETE CASCADE,
    FOREIGN KEY (LectureId) REFERENCES LECTURE(LectureId) ON DELETE CASCADE
);

CREATE TABLE REPORT (
    SEEMarks INT NOT NULL,
    CIEMarks INT NOT NULL,
    Grade CHAR(2) NOT NULL,
    Remark VARCHAR(255),
    CourseId VARCHAR(20) NOT NULL,
    ClassId INT NOT NULL,
    StudentId INT NOT NULL,
    PRIMARY KEY (CourseId, ClassId, StudentId),
    FOREIGN KEY (CourseId) REFERENCES COURSE(CourseCode) ON DELETE CASCADE,
    FOREIGN KEY (ClassId) REFERENCES CLASS(ClassId) ON DELETE CASCADE,
    FOREIGN KEY (StudentId) REFERENCES USERS(UserId) ON DELETE CASCADE
);

CREATE TABLE ASSIGNMENT (
    AssignmentId INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(255) NOT NULL,
    Description TEXT NOT NULL,
    GivenOn DATE NOT NULL,
    Deadline DATE NOT NULL,
    ClassId INT NOT NULL,
    CourseId VARCHAR(20) NOT NULL,
    FOREIGN KEY (ClassId) REFERENCES CLASS(ClassId) ON DELETE CASCADE,
    FOREIGN KEY (CourseId) REFERENCES COURSE(CourseCode) ON DELETE CASCADE
);

CREATE TABLE CURRICULUM (
    ClassId INT NOT NULL,
    CourseId VARCHAR(20) NOT NULL,
    AssignedTeacherId INT NOT NULL,
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
('manoj.reddy@gmail.com', 'pass123', 'Manoj', 'K', 'Reddy', 'Teacher', '9900887766', 'Telangana', 'Hyderabad', '500001', '1979-12-15'),
('suraj.mehta@gmail.com', 'pass123', 'Suraj', 'A', 'Mehta', 'Student', '9765432109', 'Gujarat', 'Ahmedabad', '380001', '2003-04-18'),
('kavya.rao@gmail.com', 'pass123', 'Kavya', 'V', 'Rao', 'Student', '9754321098', 'Andhra Pradesh', 'Vijayawada', '520001', '2004-06-25'),
('vishal.gupta@gmail.com', 'pass123', 'Vishal', 'S', 'Gupta', 'Student', '9743210987', 'Rajasthan', 'Jaipur', '302001', '2003-08-30'),
('ananya.desai@gmail.com', 'pass123', 'Ananya', 'P', 'Desai', 'Student', '9732109876', 'Gujarat', 'Surat', '395001', '2004-01-15'),
('rohan.thakur@gmail.com', 'pass123', 'Rohan', 'N', 'Thakur', 'Student', '9721098765', 'Himachal Pradesh', 'Shimla', '171001', '2003-10-08'),
('prof.rajesh@gmail.com', 'pass123', 'Rajesh', 'K', 'Malhotra', 'Teacher', '9710987654', 'Punjab', 'Chandigarh', '160001', '1978-05-20'),
('prof.smita@gmail.com', 'pass123', 'Smita', 'R', 'Bose', 'Teacher', '9709876543', 'West Bengal', 'Kolkata', '700001', '1982-11-12'),
('prof.anil@gmail.com', 'pass123', 'Anil', 'M', 'Joshi', 'Teacher', '9698765432', 'Uttarakhand', 'Dehradun', '248001', '1981-03-25');

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
(10, 75000.00, 'TCH11111', 'Mechanical'),
(16, 68000.00, 'TCH22222', 'Computer Science'),
(17, 71000.00, 'TCH33333', 'Electrical'),
(18, 73000.00, 'TCH44444', 'Civil');

INSERT INTO STUDENT (UserId, CurrentClassId) VALUES
(1, 1),
(2, 3),
(6, 1),
(8, 2),
(9, 3),
(11, 1),
(12, 2),
(13, 3),
(14, 1),
(15, 4);

INSERT INTO COURSE (CourseCode, Name, Credits, DeptName) VALUES
('CSE101', 'Data Structures', 4, 'Computer Science'),
('CSE102', 'Database Management Systems', 4, 'Computer Science'),
('CSE103', 'Operating Systems', 4, 'Computer Science'),
('CSE104', 'Computer Networks', 4, 'Computer Science'),
('CSE105', 'Software Engineering', 3, 'Computer Science'),
('CSE106', 'Algorithm Design', 4, 'Computer Science'),
('CSE107', 'Machine Learning', 3, 'Computer Science'),
('ECE101', 'Digital Electronics', 4, 'Electronics'),
('ECE102', 'Microprocessors', 4, 'Electronics'),
('MECH101', 'Engineering Mechanics', 4, 'Mechanical'),
('MECH102', 'Thermodynamics', 4, 'Mechanical'),
('IT101', 'Web Technologies', 3, 'Information Technology'),
('IT102', 'Cloud Computing', 3, 'Information Technology'),
('EEE101', 'Electrical Circuits', 4, 'Electrical'),
('EEE102', 'Power Systems', 4, 'Electrical'),
('CIV101', 'Structural Engineering', 4, 'Civil'),
('CIV102', 'Geotechnical Engineering', 4, 'Civil');

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
('2025-10-14', '09:00:00', 60, 'Bridge Design Concepts', 'CIV101', 'https://meet.google.com/aaa-777', 'CIV101', 5),
('2025-10-15', '10:30:00', 60, 'Tree Traversal Algorithms', 'CSE101', 'https://meet.google.com/bbb-888', 'CSE101', 1),
('2025-10-16', '09:00:00', 60, 'SQL Queries and Joins', 'CSE102', 'https://meet.google.com/ccc-999', 'CSE102', 1),
('2025-10-17', '11:00:00', 60, 'Sequential Circuits', 'ECE101', 'https://meet.google.com/ddd-000', 'ECE101', 3),
('2025-10-18', '10:00:00', 60, 'Heat Transfer Basics', 'MECH102', 'https://meet.google.com/eee-111', 'MECH102', 4),
('2025-10-19', '09:30:00', 60, 'CSS Styling Techniques', 'IT101', 'https://meet.google.com/fff-222', 'IT101', 6),
('2025-10-20', '08:30:00', 60, 'AC Circuit Analysis', 'EEE101', 'https://meet.google.com/ggg-333', 'EEE101', 7),
('2025-10-21', '10:00:00', 60, 'Memory Management', 'CSE103', 'https://meet.google.com/hhh-444', 'CSE103', 2),
('2025-10-22', '11:30:00', 60, 'Network Security', 'CSE104', 'https://meet.google.com/iii-555', 'CSE104', 1),
('2025-10-23', '09:00:00', 60, 'Agile Methodology', 'CSE105', 'https://meet.google.com/jjj-666', 'CSE105', 1),
('2025-10-24', '10:30:00', 60, 'Steel Structure Design', 'CIV101', 'https://meet.google.com/kkk-777', 'CIV101', 5);

INSERT INTO ATTENDANCE (Status, StudentId, LectureId) VALUES
('Present', 1, 1),
('Absent', 2, 1),
('Present', 6, 1),
('Present', 11, 1),
('Present', 14, 1),
('Present', 1, 2),
('Partial', 6, 2),
('Present', 11, 2),
('Present', 14, 2),
('Present', 1, 3),
('Absent', 2, 3),
('Present', 9, 3),
('Present', 13, 3),
('Present', 1, 4),
('Absent', 6, 4),
('Present', 15, 4),
('Present', 8, 5),
('Present', 12, 5),
('Present', 1, 6),
('Absent', 9, 6),
('Present', 13, 6),
('Present', 1, 7),
('Partial', 6, 7),
('Present', 11, 7),
('Present', 1, 8),
('Present', 2, 8),
('Present', 6, 8),
('Present', 11, 8),
('Present', 14, 8),
('Present', 1, 9),
('Absent', 6, 9),
('Present', 11, 9),
('Present', 9, 10),
('Present', 13, 10),
('Present', 14, 11),
('Present', 1, 11),
('Present', 6, 11),
('Absent', 11, 11),
('Present', 1, 12),
('Present', 6, 12),
('Partial', 11, 12),
('Present', 14, 12),
('Present', 2, 13),
('Present', 9, 13),
('Present', 13, 13),
('Present', 15, 14),
('Present', 6, 15),
('Present', 8, 15),
('Present', 12, 15),
('Present', 9, 16),
('Present', 13, 16),
('Present', 1, 17),
('Present', 11, 17),
('Present', 1, 18),
('Present', 2, 18),
('Present', 6, 18),
('Present', 11, 18),
('Present', 14, 18),
('Present', 1, 19),
('Present', 6, 19),
('Partial', 11, 19),
('Present', 9, 20),
('Present', 13, 20);

INSERT INTO REPORT (SEEMarks, CIEMarks, Grade, Remark, CourseId, ClassId, StudentId) VALUES
(72, 24, 'A', 'Good performance', 'CSE101', 1, 1),
(65, 20, 'B', 'Needs improvement', 'CSE102', 1, 1),
(88, 25, 'A+', 'Excellent', 'ECE101', 3, 9),
(55, 18, 'C', 'Work harder', 'MECH101', 4, 6),
(90, 27, 'A+', 'Outstanding', 'IT101', 6, 8),
(80, 25, 'A', 'Very good', 'EEE101', 7, 9),
(78, 23, 'A', 'Consistent', 'CSE103', 2, 1),
(84, 26, 'A+', 'Excellent', 'CSE104', 1, 1),
(60, 19, 'B', 'Average', 'CSE105', 1, 1),
(70, 22, 'A', 'Good', 'CIV101', 5, 9),
(85, 26, 'A+', 'Excellent work', 'CSE101', 1, 2),
(75, 23, 'A', 'Good understanding', 'CSE101', 1, 6),
(68, 21, 'B+', 'Satisfactory', 'CSE102', 1, 2),
(82, 25, 'A', 'Very good performance', 'CSE102', 1, 6),
(79, 24, 'A', 'Consistent effort', 'CSE104', 1, 2),
(91, 28, 'A+', 'Outstanding achievement', 'CSE104', 1, 6),
(73, 22, 'A', 'Good progress', 'CSE105', 1, 2),
(66, 20, 'B', 'Can do better', 'CSE105', 1, 6),
(87, 26, 'A+', 'Excellent performance', 'ECE101', 3, 2),
(58, 17, 'C+', 'Needs more practice', 'MECH101', 4, 11),
(92, 29, 'A+', 'Exceptional work', 'IT101', 6, 12),
(81, 24, 'A', 'Very good', 'EEE101', 7, 13),
(77, 23, 'A', 'Good performance', 'CSE103', 2, 11),
(69, 21, 'B+', 'Satisfactory progress', 'CIV101', 5, 14);

INSERT INTO ASSIGNMENT (Title, Description, GivenOn, Deadline, ClassId, CourseId) VALUES
('Linked List Implementation', 'Implement a C program for linked list operations including insert, delete, and display functions', '2025-10-01', '2025-10-10', 1, 'CSE101'),
('ER Diagram for College DB', 'Create an Entity-Relationship diagram for the college database system', '2025-10-03', '2025-10-12', 1, 'CSE102'),
('Logic Gate Simulation', 'Design and simulate digital circuits using Logisim software', '2025-10-04', '2025-10-11', 3, 'ECE101'),
('Force Analysis', 'Solve problems on equilibrium and force analysis in mechanical systems', '2025-10-02', '2025-10-09', 4, 'MECH101'),
('Bridge Design', 'Design a basic bridge structure with proper load calculations', '2025-10-06', '2025-10-14', 5, 'CIV101'),
('Web Page Design', 'Create an HTML/CSS portfolio website with responsive design', '2025-10-05', '2025-10-13', 6, 'IT101'),
('Circuit Diagram', 'Draw basic circuit connections for electrical circuits analysis', '2025-10-04', '2025-10-11', 7, 'EEE101'),
('Thread Management', 'Implement threading in C programming language with synchronization', '2025-10-03', '2025-10-10', 2, 'CSE103'),
('Network Layers', 'Write detailed notes on OSI model layers and their functions', '2025-10-02', '2025-10-09', 1, 'CSE104'),
('SDLC Documentation', 'Explain waterfall model in software development lifecycle', '2025-10-01', '2025-10-10', 1, 'CSE105'),
('Binary Search Tree Operations', 'Implement BST insert, delete, and search operations with proper algorithms', '2025-10-08', '2025-10-18', 1, 'CSE101'),
('Normalization Exercise', 'Normalize a given database schema to 3NF with proper justification', '2025-10-10', '2025-10-20', 1, 'CSE102'),
('Flip Flop Design', 'Design and implement various types of flip flops using Verilog', '2025-10-11', '2025-10-21', 3, 'ECE101'),
('Thermodynamic Cycle Analysis', 'Analyze and compare different thermodynamic cycles with efficiency calculations', '2025-10-09', '2025-10-19', 4, 'MECH102'),
('JavaScript Interactive Website', 'Build a dynamic website using JavaScript with form validation and DOM manipulation', '2025-10-12', '2025-10-22', 6, 'IT101'),
('Power Factor Correction', 'Design a power factor correction circuit for industrial applications', '2025-10-13', '2025-10-23', 7, 'EEE101'),
('Process Scheduling Algorithms', 'Implement and compare different CPU scheduling algorithms', '2025-10-14', '2025-10-24', 2, 'CSE103'),
('Firewall Configuration', 'Configure and test firewall rules for network security', '2025-10-15', '2025-10-25', 1, 'CSE104'),
('Scrum Framework Report', 'Prepare a detailed report on Scrum framework with case studies', '2025-10-16', '2025-10-26', 1, 'CSE105'),
('Foundation Design Project', 'Design foundation for a multi-story building with soil analysis', '2025-10-17', '2025-10-27', 5, 'CIV101');

INSERT INTO CURRICULUM (ClassId, CourseId, AssignedTeacherId) VALUES
(1, 'CSE101', 3),
(1, 'CSE102', 3),
(1, 'CSE104', 3),
(1, 'CSE105', 7),
(1, 'CSE106', 16),
(2, 'CSE103', 3),
(2, 'CSE107', 16),
(3, 'ECE101', 4),
(3, 'ECE102', 4),
(4, 'MECH101', 10),
(4, 'MECH102', 10),
(5, 'CIV101', 18),
(5, 'CIV102', 18),
(6, 'IT101', 7),
(6, 'IT102', 7),
(7, 'EEE101', 17),
(7, 'EEE102', 17),
(8, 'ECE101', 4),
(8, 'ECE102', 4),
(9, 'CSE101', 16),
(9, 'CSE102', 3),
(10, 'MECH101', 10),
(10, 'MECH102', 10);
