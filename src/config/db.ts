import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  console.log(process.env.MONGO_URI)
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || '', {
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
