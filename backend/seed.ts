import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/plateform';

const users = [
  {
    fullName: 'Admin User',
    email: 'admin@plateform.com',
    password: 'Admin@1234',
    phone: '0771234567',
    role: 'admin',
    isVerified: true,
  },
  {
    fullName: 'Chef User',
    email: 'chef@plateform.com',
    password: 'Chef@1234',
    phone: '0772345678',
    role: 'chef',
    isVerified: true,
  },
  {
    fullName: 'Driver User',
    email: 'driver@plateform.com',
    password: 'Driver@1234',
    phone: '0773456789',
    role: 'driver',
    isVerified: true,
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('MongoDB Connected');

  const UserModel = (await import('./src/models/User')).default;

  for (const u of users) {
    const existing = await UserModel.findOne({ email: u.email });
    if (existing) {
      console.log(`⚠️  User already exists: ${u.email} — updating password & verifying...`);
      existing.password = await bcrypt.hash(u.password, 10);
      existing.isVerified = true;
      existing.role = u.role as any;
      await existing.save();
      console.log(`✅ Updated: ${u.role.toUpperCase()} → ${u.email}`);
    } else {
      const hashed = await bcrypt.hash(u.password, 10);
      await UserModel.create({ ...u, password: hashed });
      console.log(`✅ Created: ${u.role.toUpperCase()} → ${u.email}`);
    }
  }

  console.log('\n🎉 Seed complete! Login credentials:');
  console.log('────────────────────────────────────');
  for (const u of users) {
    console.log(`${u.role.padEnd(8)} │ ${u.email.padEnd(28)} │ ${u.password}`);
  }
  console.log('────────────────────────────────────');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
