import express from 'express';
import * as productController from '../controllers/productController.js';
import { getUserBiddingHistory } from '../controllers/bidController.js'; 

import { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct,
    getSellerDashboard
} from '../controllers/productController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public Routes
router.get('/', getAllProducts);
router.get('/:id', getProductById); // Keep only one of these

// Protected Routes
router.use(protect);

// Seller Dashboard Route
router.get('/seller/dashboard', authorizeRoles('seller'), getSellerDashboard);

// Seller CRUD operations
router.post('/', authorizeRoles('seller'), createProduct);
router.put('/:id', authorizeRoles('seller'), updateProduct);
router.delete('/:id', authorizeRoles('seller'), deleteProduct);
router.post('/:id/finalize', productController.finalizeAuction);
router.get('/:id/bids', authorizeRoles('seller'), productController.getProductBids);


router.get('/user/history', getUserBiddingHistory); 

export default router;