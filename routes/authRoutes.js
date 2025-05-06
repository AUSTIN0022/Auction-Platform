import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { login, register } from '../controllers/authController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  });
  
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
  });

export default router;
