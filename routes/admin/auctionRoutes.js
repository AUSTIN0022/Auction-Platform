import express from 'express';
import { createAuction, deleteAuctions, getAllAuctions, getAuctionById, getAuctionsCategories, publishAuction, updateAuctions } from '../../controllers/admin/auctionController.js';
import { authorizeRole } from '../../middleware/authorizeRole.js';
import { isLoggedIn } from '../../middleware/isLoggedIn.js';
import { uploadAuctionImages } from '../../utils/cloudinary.js';


const router = express.Router();

router.use(isLoggedIn, authorizeRole('admin'));


router.get('/', getAllAuctions);
router.get('/categories', getAuctionsCategories);
router.post('/create', uploadAuctionImages.array('auction_images', 5), createAuction);
router.get('/:id', getAuctionById);
router.put('/:id',updateAuctions);
router.delete('/:id',deleteAuctions);
router.put('/:id/publish', publishAuction);



export default router;

