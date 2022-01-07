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

const AppError = require("./controlError/AppError")

// Admin routes
const adminCategories = require("./routes/admin/categories")
const adminProduct = require("./routes/admin/product")
const adminUsers = require("./routes/admin/user")
// Public routes
const Product = require("./routes/product")
const Home = require("./routes/homePage")

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "Connection Error:"))
db.once("open", () => console.log(`Database connected successfully...`))

const app = express()

app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(compression())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "public")))

const validity = (day) => 1000 * 60 * 60 * 24 * day

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

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

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

const handleValidationErr = (err) => {
  return new AppError(`Validation Failed...${err.message}`, 400)
}

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") err = handleValidationErr(err)
  next(err)
})

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
