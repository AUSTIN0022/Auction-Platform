import express from 'express';
import { getAllUsers } from '../../controllers/admin/userController.js';
import { authorizeRole } from './../../middleware/authorizeRole.js';
import { isLoggedIn } from './../../middleware/isLoggedIn.js';

const router = express.Router();
router.use(isLoggedIn, authorizeRole('admin'));

router.get('/', getAllUsers);

export default router;
