const passport = require('passport');
const UsersModel = require('../models/UsersModel');

const usersModel = new UsersModel();

// Render login page
exports.getLogin = (req, res) => {
    res.render('login');
};

// Protected route middleware
exports.protected = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

// Google authentication
exports.googleAuth = passport.authenticate('google', { scope: ['email', 'profile'] });

// Google callback
exports.googleCallback = passport.authenticate('google', {
    successRedirect: '/contactos',
    failureRedirect: '/login'
});

// Handle login
exports.postLogin = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/contactos',
        failureRedirect: '/login',
        failureFlash: false // Enable if using connect-flash for flash messages
    })(req, res, next);
};

// Render signup page
exports.getSignup = (req, res) => {
    res.render('signup');
};

// Handle signup form submission
exports.postSignup = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).send('¡Se requiere nombre de usuario, correo electrónico y contraseña!');
        return;
    }

    try {
        const existingUserByEmail = await usersModel.getUserByEmail(email);
        const existingUserByUsername = await usersModel.getUserByUsername(username);
        if (existingUserByEmail) {
            res.status(400).send('El correo electrónico ya está registrado.');
            return;
        }
        if (existingUserByUsername) {
            res.status(400).send('El nombre de usuario ya está en uso.');
            return;
        }

        await usersModel.createUser(username, email, password);
        res.send('Signup successful!');
    } catch (err) {
        res.status(500).send('Error al registrarse, intente nuevamente.');
    }
};
