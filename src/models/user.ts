import mongoose, { Schema } from 'mongoose';

const userSchema: Schema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    googleId: { type: String },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
  }, { timestamps: true });


  
const adminSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const superAdminSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });
  
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);

export { Admin, SuperAdmin, User };

