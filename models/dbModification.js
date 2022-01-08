require("dotenv").config()

const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
})

const c = require("./category"),
  p = require("./admin_product")

c.deleteMany({})
p.deleteMany({})

mongoose.disconnect()
