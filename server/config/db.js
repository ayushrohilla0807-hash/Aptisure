import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aptisure_chat';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB] Primary connection failed: ${error.message}`);
    console.log(`[MongoDB] Attempting in-memory MongoDB fallback for smooth academic development...`);

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[MongoDB] In-Memory MongoDB running and connected at: ${memUri}`);
      return conn;
    } catch (memError) {
      console.error(`[MongoDB] Fatal: Could not initialize database: ${memError.message}`);
      process.exit(1);
    }
  }
};
