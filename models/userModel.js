import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true
    },
    identityNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String, 
        required: true 
    } // Add password field
});

const User = mongoose.model('User', userSchema);

export default User;
