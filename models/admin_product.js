const mongoose = require("mongoose")
const category = require("./category")
const { Schema } = mongoose

const ImageSchema = new Schema({
  url: String,
  filename: String,
})

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_150")
})

const productSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required."],
  },
  desc: {
    type: String,
    required: [true, "Description is required."],
  },
  price: {
    type: Number,
    required: [true, "Price should must be a numeric value."],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  images: [ImageSchema],
})

productSchema.post("findOneAndDelete", async (product) => {
  await category.findByIdAndUpdate(product.category, {
    $pull: { products: product },
  })
})

module.exports = mongoose.model("Product", productSchema)
