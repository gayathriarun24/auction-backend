import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid Email'] 
    },
    password: { 
        type: String, 
        required: true 
    },
    contactInfo: { 
        type: String, 
        required: true,
        match: [/^[6-9]\d{9}$/, 'Invalid Phone Number']
    },
    role: { 
        type: String, 
        enum: ['buyer', 'seller'], 
        default: 'buyer' 
    },
    sellerRating: { 
        type: Number, 
        default: 5
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);