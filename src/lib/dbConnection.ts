import { log } from "console";
import mongoose from "mongoose";


type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};// Create a connection object

async function dbConnection() {
  if (connection.isConnected) {// Check if the connection is already established
    log("Database already connnection");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});// Add your connection string here
    connection.isConnected = db.connections[0].readyState;// 1 = connected, 2 = connecting, 0 = disconnected || connections[0] for the first connection
    log("Database connected");
  } catch (error) {
    log("Database connection error", error);// Log the error
    process.exit(1);// Exit the process if the connection fails
  }
}

export default dbConnection;
