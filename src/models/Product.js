import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    sellerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    auctionType: { 
        type: String, 
        enum: ['traditional', 'reverse', 'sealed'], 
        required: true 
    },
    startingPrice: { 
        type: Number, 
        required: true 
    },
    currentHighestBid: { 
        type: Number, 
        default: 0 
    },
    currentHighestBidder: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        default: null 
    },
    status: { 
        type: String, 
        enum: ['active', 'unsold', 'completed', 'closed'], 
        default: 'active' 
    },
    winnerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
},
finalPrice: { 
    type: Number, 
    default: 0 
},
    endTime: { 
        type: Date, 
        required: true 
    }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);