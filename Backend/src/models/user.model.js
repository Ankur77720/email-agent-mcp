import mongoose from 'mongoose';
import crypto from 'crypto-js';
import config from '../config/config.js';
import jwt from 'jsonwebtoken';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleRefreshToken: {
        type: String,
        required: true
    },
})



userSchema.pre('save', async function (next) {
    if (this.isModified("googleRefreshToken")) {
        const cipherText = crypto.AES.encrypt(this.googleRefreshToken, config.GOOGLE_SECRET_KEY).toString();
        this.googleRefreshToken = cipherText;
    }
    next();
})


userSchema.methods.decryptGoogleRefreshToken = function () {
    const bytes = crypto.AES.decrypt(this.googleRefreshToken, config.GOOGLE_SECRET_KEY);
    const originalText = bytes.toString(crypto.enc.Utf8);
    return originalText;
}

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ id: this._id }, config.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

userSchema.statics.authToken = async function (token) {
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await this.findById(decoded.id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        throw new Error('Invalid token');
    }
}

const User = mongoose.model('user', userSchema);


export default User;    