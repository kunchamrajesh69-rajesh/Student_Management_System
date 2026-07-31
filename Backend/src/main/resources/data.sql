-- ====================================================================
-- Student Management System - Initial Data Seeding DML
-- Pre-populates sample students into the database
-- ====================================================================

INSERT INTO student (id, name, roll_number, email, phone, course, `year`, status) VALUES
(1, 'Aarav Sharma',  '22CS001', 'aarav.sharma@college.edu',  '9876543210', 'B.Tech CSE',  3, 'Active'),
(2, 'Diya Reddy',    '22CS002', 'diya.reddy@college.edu',    '9876543211', 'B.Tech CSE',  3, 'Active'),
(3, 'Rohan Verma',   '22EC014', 'rohan.verma@college.edu',   '9876543212', 'B.Tech ECE',  2, 'Active'),
(4, 'Sneha Patil',   '21ME108', 'sneha.patil@college.edu',   '9876543213', 'B.Tech MECH', 4, 'Inactive'),
(5, 'Karthik Nair',  '23IT045', 'karthik.nair@college.edu',  '9876543214', 'B.Tech IT',   1, 'Active'),
(6, 'Ananya Iyer',   '22CS019', 'ananya.iyer@college.edu',   '9876543215', 'B.Tech CSE',  3, 'Active'),
(7, 'Vikram Singh',  '21CV072', 'vikram.singh@college.edu',  '9876543216', 'B.Tech CIVIL',4, 'Active'),
(8, 'Meera Joshi',   '23EC031', 'meera.joshi@college.edu',   '9876543217', 'B.Tech ECE',  1, 'Inactive');
