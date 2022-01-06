const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const wrapAsync = require("../../controlError/wrapasync");
const AppError = require("../../controlError/AppError");

const passport = require("passport");

router.get("/", wrapAsync(async (req, res) => {
  throw new AppError("Page not found", 404);
  res.render(33);
}));

router.get(
  "/register",
  wrapAsync(async (req, res, next) => {
    res.render("register", { title: "register" });
  })
);

router.post(
  "/register",
  wrapAsync(async (req, res, next) => {
    try {
      const { name, email, username, password } = req.body;
      const user = new User({ name, email, username });

      const registeredUser = await User.register(user, password);

      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to back!");
        res.redirect("/");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/users/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/users/login",
  }),
  (req, res) => {
    req.flash("success", "welcome back!");
    if (req.username != "bala") {
      const redirectUrl = req.session.returnTo || "/";
      delete req.session.returnTo;
      res.redirect(redirectUrl);
    } else {
      const redirectUrl = req.session.returnTo || "/admin/products";
      delete req.session.returnTo;
      res.redirect(redirectUrl);
    }
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Have a nice day!!!");
  res.redirect("/");
});

module.exports = router;