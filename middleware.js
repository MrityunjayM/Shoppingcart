module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash("error", "you must be signed in frst!");
        return res.redirect("/users/login");
    }
    // console.log('authenticated');
    next();
}

module.exports.isAdmin = (req, res, next) => {

    if (req.isAuthenticated() && req.user.admin == true) {
        next();
    } else {
        req.flash('error', 'Please log in as admin.');
        res.redirect('/admin/products');
        // res.redirect('/users/login');

    }
}