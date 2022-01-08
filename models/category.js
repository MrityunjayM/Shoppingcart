const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Product = require("./admin_product")

const cateogrySchema = new Schema({
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

cateogrySchema.post("findOneAndDelete", async (doc) => {
  // await Product.findOneAndRemove()
  await Product.deleteMany(doc.products)
})

module.exports = mongoose.model("Category", cateogrySchema)
