module.exports = function(app, passport) {

    // Middleware to save the original URL
    function isAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        // Save the original URL to redirect after login
        req.session.returnTo = req.originalUrl;
        res.redirect('/login'); // Redirect to login if not authenticated
    }

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs', {
            isAuthenticated: req.isAuthenticated()
        }); // Load the index.ejs file with authentication state
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // Show the login form
    app.get('/login', function(req, res) {
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        }); // Render login.ejs with flash messages
    });

    // Process the login form
    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/login'); }

            req.logIn(user, function(err) {
                if (err) { return next(err); }

                // Redirect to the originally requested URL
                if (req.session.returnTo) {
                    const redirectUrl = req.session.returnTo;
                    delete req.session.returnTo;
                    return res.redirect(redirectUrl);
                } else {
                    return res.redirect('/profile'); // Default redirect
                }
            });
        })(req, res, next);
    });

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // Show the signup form
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        }); // Render signup.ejs with flash messages
    });

    // Process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // Redirect to the profile section if signup is successful
        failureRedirect: '/signup',  // Redirect back to the signup page if there is an error
        failureFlash: true           // Allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =========================
    // =====================================
    // Protected profile section
    app.get('/profile', isAuthenticated, function(req, res) {
        res.render('profile.ejs', {
            user: req.user // Get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/'); // Redirect to the homepage after logout
    });

    // =====================================
    // PROTECTED ROUTES =====================
    // =====================================
    // Apply authentication middleware to protect routes
    app.get('/about', isAuthenticated, (req, res) => {
        res.render('about.ejs'); // Load about.ejs file
    });

    app.get('/stades', isAuthenticated, (req, res) => {
        res.render('stades.ejs'); // Load stades.ejs file
    });

};
