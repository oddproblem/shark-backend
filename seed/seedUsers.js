import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import connectDB from '../config/db.js';

// Load environment variables
dotenv.config();

const run = async () => {
  await connectDB(process.env.MONGO_URI || "mongodb+srv://abys7315:Abys2875%40%23@sparkathon.ho8cuvo.mongodb.net/?retryWrites=true&w=majority&appName=sparkathon");

  // existing single admin (for backward compatibility)
  const admin = process.env.ADMIN_SEED || 'abhay@gmail.com:abhay1';
  const mgr = process.env.EVENTMANAGER_SEED || 'ankita@gmail.com:ankita';

  const [adminEmail, adminPass] = admin.split(':');
  const [mgrEmail, mgrPass] = mgr.split(':');

  // --- NEW: multiple admins support ---
  const extraAdmins = [
    { email: 'abhay2@gmail.com', password: 'abhay2', regNumber: 'ADMIN002', contactNumber: '9999999992' },
    { email: 'abhay3@gmail.com', password: 'abhay3', regNumber: 'ADMIN003', contactNumber: '9999999993' },
    { email: 'abhay4@gmail.com', password: 'abhay4', regNumber: 'ADMIN004', contactNumber: '9999999994' },
    { email: 'abhay5@gmail.com', password: 'abhay5', regNumber: 'ADMIN005', contactNumber: '9999999995' }
  ];

  // original admin
  if (adminEmail && adminPass) {
    const found = await User.findOne({ email: adminEmail });
    if (!found) {
      const hashed = await bcrypt.hash(adminPass, 10);
      await User.create({
        name: adminEmail.split('@')[0],
        email: adminEmail,
        password: hashed,
        role: 'admin',
        regNumber: 'ADMIN001',       // ✅ unique
        contactNumber: '9999999991', // ✅ unique
      });
      console.log('Created admin:', adminEmail);
    }
  }

  // loop through extra admins
  for (const adm of extraAdmins) {
    const found = await User.findOne({ email: adm.email });
    if (!found) {
      const hashed = await bcrypt.hash(adm.password, 10);
      await User.create({
        name: adm.email.split('@')[0],
        email: adm.email,
        password: hashed,
        role: 'admin',
        regNumber: adm.regNumber,
        contactNumber: adm.contactNumber,
      });
      console.log('Created admin:', adm.email);
    }
  }

  // original manager
  if (mgrEmail && mgrPass) {
    const found = await User.findOne({ email: mgrEmail });
    if (!found) {
      const hashed = await bcrypt.hash(mgrPass, 10);
      await User.create({
        name: mgrEmail.split('@')[0],
        email: mgrEmail,
        password: hashed,
        role: 'event-manager',
        regNumber: 'MGR001',
        contactNumber: '8888888888',
      });
      console.log('Created manager:', mgrEmail);
    }
  }

  process.exit(0);
};

run().catch(err => {
  console.error('❌ Error seeding users:', err.message);
  process.exit(1);
});
