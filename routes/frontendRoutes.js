import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { authorizeRole } from '../middleware/authorizeRole.js';
import { isLoggedIn } from '../middleware/isLoggedIn.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// General 
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


// Only Admin

router.get('/admin-dashboard', isLoggedIn, authorizeRole('admin'), (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin-dashboard.html'));
});

router.get('/create-auction', isLoggedIn,  authorizeRole('admin'), (req, res) => {
    res.sendFile(path.join(__dirname, '../views/create-auction.html'));
});

router.get('/document-verification', isLoggedIn, authorizeRole('admin'), (req, res) => {
    res.sendFile(path.join(__dirname, '../views/document-vertification.html'));
});

// Only User
router.get('/dashboard', isLoggedIn, authorizeRole('user'), (req, res) => {
    res.sendFile(path.join(__dirname, '../views/user-dashboard.html'));
});

// Both Admin & User
router.get('/auction-detail', isLoggedIn, authorizeRole(['admin', 'user']), (req, res) => {
    res.sendFile(path.join(__dirname, '../views/auction-detail.html'));
});




// Error page route
router.get('/error', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/error.html'));
  });

export default router;