import Bid from '../models/Bid.js';
import Product from '../models/Product.js';
import { sendOutbidEmail } from '../utils/sendEmail.js';

export const placeBid = async (req, res, next) => {
    const { productId, bidAmount } = req.body;
    const buyerId = req.user._id;

    if (req.user.role === 'seller') {
        res.status(403);
        return next(new Error('Access Denied: Sellers are not permitted to participate in bidding.'));
    }

    try {
        const product = await Product.findById(productId).populate('currentHighestBidder', 'name email');
        if (!product) {
            res.status(404);
            return next(new Error('Auction item not found'));
        }

        if (product.status !== 'active' || new Date() > new Date(product.endTime)) {
            res.status(400);
            return next(new Error('This auction has closed or is inactive'));
        }

        if (product.sellerId.toString() === buyerId.toString()) {
            res.status(400);
            return next(new Error('You cannot place a bid on your own listed product'));
        }

        const previousBidder = product.currentHighestBidder;

        if (product.auctionType === 'traditional') {
            if (bidAmount <= product.currentHighestBid) {
                res.status(400);
                return next(new Error(`Bid must be strictly higher than the current highest bid of $${product.currentHighestBid}`));
            }
            product.currentHighestBid = bidAmount;
            product.currentHighestBidder = buyerId;
            
            if (previousBidder && previousBidder.email) {
                sendOutbidEmail(previousBidder.email, previousBidder.name, product.title, bidAmount);
            }

        } else if (product.auctionType === 'reverse') {
            if (bidAmount >= product.currentHighestBid) {
                res.status(400);
                return next(new Error(`Bid must be lower than the current reverse floor of $${product.currentHighestBid}`));
            }
            product.currentHighestBid = bidAmount;
            product.currentHighestBidder = buyerId;

        } else if (product.auctionType === 'sealed') {
            if (bidAmount < product.startingPrice) {
                res.status(400);
                return next(new Error(`Sealed bid must meet the minimum starting price of $${product.startingPrice}`));
            }
              }

        // 4. Save the historical log entry
        const bidLog = await Bid.create({
            productId,
            buyerId,
            bidAmount
        });

        // 5. Save product updates
        await product.save();

        res.status(201).json({
            message: 'Bid successfully registered',
            bidLog
        });

    } catch (error) {
        next(error);
    }
};

export const getProductBidHistory = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productId);
        
        // Safety guard for Sealed Bids (Prompt states sealed bids shouldn't leak logs blindly)
        if (product && product.auctionType === 'sealed' && product.sellerId.toString() !== req.user?._id.toString()) {
            res.status(403);
            return next(new Error('Bid logs for sealed auctions are private until auction completion.'));
        }

        const history = await Bid.find({ productId: req.params.productId })
            .populate('buyerId', 'name email')
            .sort({ bidTime: -1 });

        res.json(history);
    } catch (error) {
        next(error);
    }
};

export const getUserBiddingHistory = async (req, res, next) => {
    try {
        const userHistory = await Bid.find({ buyerId: req.user._id })
            .populate({
                path: 'productId',
                select: 'title image auctionType status winnerId'
            })
            .sort({ bidTime: -1 });

        res.json(userHistory);
    } catch (error) {
        next(error);
    }
};