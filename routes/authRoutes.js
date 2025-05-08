import express from 'express';
import multer from 'multer';
import { login, register } from '../controllers/authController.js';
import { storage } from '../utils/cloudinary.js';

const upload = multer({ storage });

const router = express.Router();

router.post('/register', upload.single('id_proof'), register);
router.post('/login', login);

export default router;
