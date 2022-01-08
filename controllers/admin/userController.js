const User = require("../../models/user")

module.exports.renderRegisterationForm = async (req, res) => {
  res.render("register", { title: "Register" })
}

module.exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, username, password } = req.body
    const user = new User({ name, email, username })

    const registeredUser = await User.register(user, password)

    req.login(registeredUser, (err) => {
      if (err) return next(err)
      req.flash("success", "Have a nice journey.")
      res.redirect("/")
    })
  } catch (e) {
    req.flash("error", e.message)
    res.redirect("/users/register")
  }
}

module.exports.renderLoginForm = (req, res) =>
  res.render("login", { title: "Login" })

module.exports.loginUser = (req, res) => {
  req.flash("success", "Happy to see you...")
  if (req.username != "bala") {
    const redirectUrl = req.session.returnTo || "/"
    delete req.session.returnTo
    res.redirect(redirectUrl)
  } else {
    const redirectUrl = req.session.returnTo || "/admin/products"
    delete req.session.returnTo
    res.redirect(redirectUrl)
  }
}

module.exports.logoutUser = (req, res) => {
  req.logout()
  req.flash("success", "Have a nice day!!!")
  res.redirect("/")
}
