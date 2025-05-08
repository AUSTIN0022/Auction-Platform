import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/landing-page.html'));
});

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/registration.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});

router.get('/terms-conditions', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/terms-conditions.html'));
});

router.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin-dashboard.html'));
});

router.get('/auction-detail', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/auction-detail.html'));
});

router.get('/create-auction', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/create-auction.html'));
});

router.get('/document-verification', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/document-vertification.html'));
});


router.get('/user-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/user-dashboard.html'));
});



export default router;
