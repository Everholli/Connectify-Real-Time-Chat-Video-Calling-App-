import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.Mongodb_URI)
        console.log(`MongoDB ic connected to the host ${conn.connection.host}`);
        
    } catch (error) {
        console.log("Error in MOngoDB connection", error);
        process.exit(1); // 1 means failure
    }
}