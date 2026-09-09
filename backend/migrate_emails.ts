import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User';

dotenv.config();

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const users = await User.find({});
  for (const user of users) {
    const lowerEmail = user.email.toLowerCase().trim();
    if (user.email !== lowerEmail) {
      user.email = lowerEmail;
      await user.save();
      console.log(`Updated user: ${user.email}`);
    }
  }
  console.log('Migration complete');
  await mongoose.disconnect();
}

migrate();
