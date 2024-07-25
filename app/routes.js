const express = require('express');
const pool = require('../config/database');
const passport = require('passport');

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.redirect('/'); // Redirect to home if not an admin
}

module.exports = function(app, passport, isAuthenticated) {
    // Home page route
    app.get('/', (req, res) => {
        res.render('index.ejs', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user // Pass the user object to the template
        });
    });

    // Login routes
    app.get('/login', (req, res) => {
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    app.post('/login', (req, res, next) => {
        passport.authenticate('local-login', async (err, user, info) => {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/login'); }

            req.logIn(user, async (err) => {
                if (err) { return next(err); }

                // Redirect based on user role
                if (user.role === 'admin') {
                    return res.redirect('/manage-agenda'); // Redirect admin to manage-agenda
                } else if (req.session.returnTo) {
                    const redirectUrl = req.session.returnTo;
                    delete req.session.returnTo;
                    return res.redirect(redirectUrl); // Redirect to the originally requested URL
                } else {
                    return res.redirect('/profile'); // Default redirect for regular users
                }
            });
        })(req, res, next);
    });

    // Signup routes
    app.get('/signup', (req, res) => {
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    // Profile route
    app.get('/profile', isAuthenticated, (req, res) => {
        res.render('profile.ejs', {
            user: req.user
        });
    });

    // Logout route
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    // Protected routes
    app.get('/about', isAuthenticated, (req, res) => {
        res.render('about.ejs', {
            user: req.user // Pass the user object to the template
        });
    });

    app.get('/recolte', isAuthenticated, (req, res) => {
        res.render('recolte.ejs', {
            user: req.user // Pass the user object to the template
        });
    });

    // Agenda display route
    app.get('/stades', isAuthenticated, async (req, res) => {
        try {
            const [agendaItems] = await pool.query('SELECT * FROM olive_agenda');
            res.render('stades.ejs', {
                agendaItems,
                user: req.user // Pass the user object to the template
            });
        } catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).send('Server error');
        }
    });

    // Management page route
    app.get('/manage-agenda', isAdmin, async (req, res) => {
        try {
            const [agendaItems] = await pool.query('SELECT * FROM olive_agenda');
            res.render('manage_agenda.ejs', {
                agendaItems,
                user: req.user // Pass the user object to the template
            });
        } catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).send('Server error');
        }
    });

    // Add new agenda item
    app.post('/manage-agenda/add', isAdmin, async (req, res) => {
        const { image_url, month, change_name } = req.body;
        try {
            await pool.query('INSERT INTO olive_agenda (image_url, month, change_name) VALUES (?, ?, ?)', [image_url, month, change_name]);
            res.redirect('/manage-agenda');
        } catch (error) {
            console.error('Error adding agenda item:', error);
            res.status(500).send('Server error');
        }
    });

    // Delete agenda item
    app.post('/manage-agenda/delete/:id', isAdmin, async (req, res) => {
        const { id } = req.params;
        try {
            await pool.query('DELETE FROM olive_agenda WHERE id = ?', [id]);
            res.redirect('/manage-agenda');
        } catch (error) {
            console.error('Error deleting agenda item:', error);
            res.status(500).send('Server error');
        }
    });

    // Update agenda item
    app.post('/manage-agenda/edit/:id', isAdmin, async (req, res) => {
        const { id } = req.params;
        const { image_url, month, change_name } = req.body;
        try {
            await pool.query('UPDATE olive_agenda SET image_url = ?, month = ?, change_name = ? WHERE id = ?', [image_url, month, change_name, id]);
            res.redirect('/manage-agenda');
        } catch (error) {
            console.error('Error updating agenda item:', error);
            res.status(500).send('Server error');
        }
    });
};
