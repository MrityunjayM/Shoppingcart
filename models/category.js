const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CateogrySchema = new Schema({
  title: {
    type: String,
    required: [true, "Title required."],
  },
  slug: String,
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
})

module.exports = mongoose.model("Category", CateogrySchema)
