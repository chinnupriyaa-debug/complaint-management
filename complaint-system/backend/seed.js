// ============================================
// DATABASE SEED SCRIPT
// Creates sample users and complaints
// ============================================

import mongoose from 'mongoose';
import User from './models/User.js';
import Complaint from './models/Complaint.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anna_complaints';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Complaint.deleteMany({});
    console.log('Cleared existing data');

    // Create Faculty Users
    const faculty1 = new User({
      username: 'faculty1',
      password: 'faculty123',
      email: 'faculty1@annauniv.edu',
      role: 'faculty',
      department: 'Computer Science'
    });

    const faculty2 = new User({
      username: 'admin',
      password: 'admin123',
      email: 'admin@annauniv.edu',
      role: 'faculty',
      department: 'Administration'
    });

    await faculty1.save();
    await faculty2.save();
    console.log('Created faculty users');

    // Create Student Users
    const student1 = new User({
      username: 'student1',
      password: 'student123',
      email: 'student1@annauniv.edu',
      role: 'student',
      department: 'Computer Science'
    });

    const student2 = new User({
      username: 'student2',
      password: 'student123',
      email: 'student2@annauniv.edu',
      role: 'student',
      department: 'Electronics'
    });

    const student3 = new User({
      username: 'rahul',
      password: 'rahul123',
      email: 'rahul@annauniv.edu',
      role: 'student',
      department: 'Mechanical'
    });

    await student1.save();
    await student2.save();
    await student3.save();
    console.log('Created student users');

    // Create Sample Complaints
    const complaints = [
      {
        studentId: student1._id,
        studentUsername: 'student1',
        issue: 'Wi-Fi/Internet',
        priority: 'High',
        complaint: 'The Wi-Fi in the computer lab is extremely slow and disconnects frequently. This is affecting our project work.',
        status: 'Pending'
      },
      {
        studentId: student1._id,
        studentUsername: 'student1',
        issue: 'Lab Equipment',
        priority: 'Critical',
        complaint: 'Several computers in Lab 3 are not working. The monitors are displaying error messages.',
        status: 'Rectified',
        facultyId: faculty1._id,
        facultyResponse: 'Lab technicians have been notified and computers have been repaired.',
        resolvedAt: new Date()
      },
      {
        studentId: student2._id,
        studentUsername: 'student2',
        issue: 'Library',
        priority: 'Medium',
        complaint: 'The reference books for Digital Signal Processing are outdated. Request for new editions.',
        status: 'In Progress',
        facultyId: faculty1._id,
        facultyResponse: 'New books have been ordered. Expected to arrive next week.'
      },
      {
        studentId: student3._id,
        studentUsername: 'rahul',
        issue: 'Canteen',
        priority: 'Low',
        complaint: 'The canteen closes too early. Please extend the timing till 8 PM.',
        status: 'Pending'
      },
      {
        studentId: student2._id,
        studentUsername: 'student2',
        issue: 'Infrastructure',
        priority: 'High',
        complaint: 'Air conditioning in Seminar Hall 2 is not working. Very uncomfortable during presentations.',
        status: 'Pending'
      }
    ];

    await Complaint.insertMany(complaints);
    console.log('Created sample complaints');

    console.log('\n========================================');
    console.log('  DATABASE SEEDED SUCCESSFULLY!');
    console.log('========================================');
    console.log('\nTest Credentials:');
    console.log('----------------------------------------');
    console.log('FACULTY:');
    console.log('  Username: faculty1, Password: faculty123');
    console.log('  Username: admin, Password: admin123');
    console.log('----------------------------------------');
    console.log('STUDENTS:');
    console.log('  Username: student1, Password: student123');
    console.log('  Username: student2, Password: student123');
    console.log('  Username: rahul, Password: rahul123');
    console.log('----------------------------------------\n');

    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
