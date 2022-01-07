// importing necessary modules...
const path = require("path")
const express = require("express")
const compression = require("compression")
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate")
const session = require("express-session")
const flash = require("connect-flash")
const methodOverride = require("method-override")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user")
// Utility func...
const { validity, handleValidationErr } = require("./utils")
// Admin routes
const adminCategories = require("./routes/admin/categories")
const adminProduct = require("./routes/admin/product")
const adminUsers = require("./routes/admin/user")
// Public routes
const Product = require("./routes/product")
const Home = require("./routes/homePage")
// mongoDB config...
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "Connection Error:"))
db.once("open", () => console.log(`Database connected successfully...`))
// Express initialization...
const app = express()
// view engine setup...
app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
// middlewares...
app.use(compression())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "public")))
// session config...
const sessionConfig = {
  secret: process.env.SECRET_KEY,
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + validity(7),
    maxAge: validity(7),
  },
}
// session initialization...
app.use(session(sessionConfig))
app.use(flash())
// passport middleware...
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
// setting local varibles...
app.use((req, res, next) => {
  res.locals.currentUser = req.user
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  next()
})
// ROUTES
app.get("/", Home)
app.use("/products", Product)
app.use("/users", adminUsers)
app.use("/admin/products", adminProduct)
app.use("/admin/categories", adminCategories)
// Error handeler....
// VALIDATION ERROR
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") err = handleValidationErr(err)
  next(err)
})
// ERRORS...
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Oops!! something went wrong" } = err
  console.log(message)
  if (err) {
    res.status(statusCode).render("error", { err })
  }
})

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`APP IS LISTENING ON http://localhost:${PORT}`)
})

process.on("uncaughtException", (e) => console.log(e))
