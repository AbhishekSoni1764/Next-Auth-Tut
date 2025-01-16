import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already Connected to the Database");
    return;
  }

  try {
    const connectionURL = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DATABASE_NAME}` || "",
      {}
    );

    connection.isConnected = connectionURL.connections[0].readyState;

    console.log("Database connected successfully");
  } catch (error) {
    console.error("Something went wrong while connecting to Database!", error);
    process.exit(1);
  }
}

export default dbConnect;
