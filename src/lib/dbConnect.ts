import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};

async function connectDatabase(): Promise<void> {

    if (connection.isConnected) {
        console.log("Already connected to Database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || '');
        connection.isConnected = db.connections[0].readyState;
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Error in Connecting Database", error);
        process.exit();
    }
}

export default connectDatabase;