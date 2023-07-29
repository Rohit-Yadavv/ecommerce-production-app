import colors from 'colors';
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log("connected".bgGreen);
    } catch (error) {
    }
}
export default connectDB;










