// routes/index.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { ensureAuthenticated } = require('../utils/middleware');
const ContactosController = require("../controllers/ContactosController");

const contactosController = new ContactosController();

router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

router.get('/protected', ensureAuthenticated, (req, res) => {
    res.send('This is a protected route');
});

router.get('/auth/google', authController.googleAuth);
router.get('/auth/google/callback', authController.googleCallback);

router.get('/contactos', ensureAuthenticated, contactosController.getAll);
router.post('/form-contact', ensureAuthenticated, contactosController.add);

module.exports = router;
