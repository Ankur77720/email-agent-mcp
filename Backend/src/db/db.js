import mongoose from 'mongoose';
import config from '../config/config.js';


function connectDB() {
    mongoose.connect(config.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.log('MongoDB connected');
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err);
        });
}

export default connectDB;