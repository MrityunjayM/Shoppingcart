module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You need to signed in frst!");
    return res.redirect("/users/login");
  }
  next();
};

module.exports.isAdmin = (req, res, next) => {
  if (!req.user.admin) {
    req.logout();
    req.flash("error", "Oops!!, you're not an admin.");
    return res.redirect("/users/login");
  }
  next();
};
