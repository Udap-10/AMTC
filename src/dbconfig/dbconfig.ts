import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables");
}

// Global cache to prevent multiple connections
let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connect() {
  if (cached.conn) return cached.conn; // Return existing connection

  if (!cached.promise) {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }
    cached.promise = mongoose
      .connect(MONGO_URI)
      .then((mongoose) => {
        console.log("MongoDB connected");
        return mongoose;
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        process.exit(1);
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Save cached connection globally
(global as any).mongoose = cached;
