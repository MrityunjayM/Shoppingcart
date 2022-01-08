const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
})

async function modify() {
  try {
    await mongoose.connection.dropCollection("categories")
    await mongoose.connection.dropCollection("products")
  } catch (error) {
    console.dir(error)
  } finally {
    mongoose.disconnect()
  }
}

modify()
