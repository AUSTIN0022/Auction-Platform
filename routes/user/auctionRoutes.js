import express from 'express';
import {
    browseAuctions,
    getParticipatingAuctions,
    payEmd,
    registerForAuction,
    viewAuctionDetails
} from '../../controllers/user/auctionController.js';
import { authorizeRole } from '../../middleware/authorizeRole.js';
import { isLoggedIn } from '../../middleware/isLoggedIn.js';

const router = express.Router();
router.use(isLoggedIn, authorizeRole('user'));

router.get('/', browseAuctions);
router.get('/:id', viewAuctionDetails);
router.get('/participating', getParticipatingAuctions);
router.post('/:id/register', registerForAuction);
router.post('/:id/emd/pay', payEmd);

export default router;