import Product from '../models/Product.js';
import Bid from '../models/Bid.js';
import User from '../models/User.js';
import { sendWinnerEmail } from '../utils/sendEmail.js';

// @desc    Create a new product/auction listing (Seller Only)
// @route   POST /api/products
export const createProduct = async (req, res, next) => {
    const { title, description, image, category, auctionType, startingPrice, endTime } = req.body;

    try {
        const product = await Product.create({
            sellerId: req.user._id, // Set automatically from protect middleware
            title,
            description,
            image, // Text URL or file path string
            category,
            auctionType,
            startingPrice,
            currentHighestBid: startingPrice, // Initial bid starts at the floor price
            endTime
        });

        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all active auctions (Marketplace View for Buyers/Sellers)
// @route   GET /api/products
export const getAllProducts = async (req, res, next) => {
    try {
        // Find all active products and include seller's profile details (like ratings)
        const products = await Product.find({ status: 'active' })
            .populate('sellerId', 'name sellerRating')
            .sort({ createdAt: -1 });

        res.json(products);
    } catch (error) {
        next(error);
    }
};

// @desc    Get detailed item info by ID
// @route   GET /api/products/:id
export const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('sellerId', 'name sellerRating contactInfo');

        if (!product) {
            res.status(404);
            return next(new Error('Auction item not found'));
        }

        res.json(product);
    } catch (error) {
        next(error);
    }
};

// @desc    Update product details (Seller Only)
// @route   PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404);
            return next(new Error('Auction item not found'));
        }

        // Verify that the logged-in seller actually owns this item
        if (product.sellerId.toString() !== req.user._id.toString()) {
            res.status(403);
            return next(new Error('Not authorized to update this product'));
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(product);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete product/auction listing (Seller Only)
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404);
            return next(new Error('Auction item not found'));
        }

        // Verify ownership
        if (product.sellerId.toString() !== req.user._id.toString()) {
            res.status(403);
            return next(new Error('Not authorized to delete this product'));
        }

        await product.deleteOne();
        res.json({ message: 'Auction item removed successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all products for a specific Seller's Dashboard (Active & Unsold Inventory)
// @route   GET /api/products/seller/dashboard
export const getSellerDashboard = async (req, res, next) => {
    try {
        const products = await Product.find({ sellerId: req.user._id })
        .populate('currentHighestBidder', 'name');
        res.json(products);
    } catch (error) {
        next(error);
    }
};


export const finalizeAuction = async (req, res) => {
  try {
    const { id } = req.params;
   

    // 2. Fetch the product
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

     const sortOrder = product.auctionType === 'reverse' ? 1 : -1;
    
    // 1. Fetch bids using the correct field 'productId'
    const bids = await Bid.find({ productId: id }).sort({ bidAmount: sortOrder });

    // 3. Logic to finalize
    product.status = 'completed';
    
    if (bids.length > 0) {
      // Use 'buyerId' and 'bidAmount' as defined in your Bid model schema
      product.currentHighestBidder = bids[0].buyerId;
      product.winnerId = bids[0].buyerId;
      product.finalPrice = bids[0].bidAmount;
    }

    await product.save();
    if (product.winnerId) {
  try {
    // You need to populate the winner's email first
    // Assuming you have a User model imported
    const winner = await User.findById(product.winnerId);
    
    if (winner) {
      await sendWinnerEmail(
    winner.email, 
    winner.name, 
    product.title, 
    product.finalPrice
  );
    }
  } catch (emailErr) {
    console.error("Email failed to send:", emailErr);
    // We don't throw an error here because the auction was still finalized successfully
  }
}
    res.json({ message: 'Auction finalized', product });
  } catch (err) {
    console.error("Finalize Error:", err); // The terminal will show the real reason here
    res.status(500).json({ message: 'Error finalizing', error: err.message });
  }
};


export const getProductBids = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    // Security Check: Ensure the logged-in user is the product owner
    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not the owner of this auction." });
    }

    // Retrieve all bids for this item, populated with bidder info
    const bids = await Bid.find({ productId: id })
      .populate('buyerId', 'name email') // Gets name/email of the bidder
      .sort({ bidAmount: -1 }); // Highest bid first

    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bids' });
  }
};


// In your controller (e.g., bidController.js)
export const getBidActivity = async (req, res) => {
    try {
        const bids = await Bid.find({ buyerId: req.user._id })
            .populate({
                path: 'productId',
                select: 'title status winnerId' // We need these to check if won
            })
            .sort({ createdAt: -1 });

        res.json(bids);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching activity' });
    }
};