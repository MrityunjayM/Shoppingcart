const router = require("express").Router()
const wrapAsync = require("../../controlError/wrapasync")
const passport = require("passport")

const {
  renderRegisterationForm,
  registerUser,
  loginUser,
  renderLoginForm,
  logoutUser,
} = require("../../controllers/admin/userController")

router
  .route("/register")
  .get(wrapAsync(renderRegisterationForm))
  .post(wrapAsync(registerUser))

router
  .route("/login")
  .get(renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/users/login",
    }),
    loginUser
  )

router.get("/logout", logoutUser)

module.exports = router
