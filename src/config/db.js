import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connectionOptions = {
      autoIndex: true, // Builds our geospatial indexes automatically
      maxPoolSize: 10, // Optimized connection pooling for high-concurrency requests
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging forever
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, connectionOptions);
    console.log(`📡 MongoDB Engine Engaged: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Critical Database Connection Failure: ${error.message}`);
    // Immediately terminate the server runtime if our primary data layer is unreachable
    process.exit(1);
  }
};