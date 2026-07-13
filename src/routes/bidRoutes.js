import express from 'express';
import { placeBid, getProductBidHistory, getUserBiddingHistory } from '../controllers/bidController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All bidding features strictly require authentication
router.use(protect);

router.post('/', placeBid);
router.get('/user/history', getUserBiddingHistory);
router.get('/product/:productId', getProductBidHistory);

export default router;