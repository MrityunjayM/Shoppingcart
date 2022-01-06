const Product = require("../models/admin_product")
const Category = require("../models/category")
const wrapAsync = require("../controlError/wrapasync")
const AppError = require("../controlError/AppError")

const { cloudinary } = require('../cloudinary')

module.exports.getAllProducts = async (req, res, next) => {
  const products = await Product.find({})
  res.render("admin/products", { products })
}

module.exports.renderProductForm = async (req, res, next) => {
  const desc = ""
  const price = ""
  const categories = await Category.find({})
  res.render("admin/add_product", { desc, price, categories })
}

module.exports.addProduct = async (req, res, next) => {
  const newProduct = new Product({ ...req.body.product })
  newProduct.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }))

  if (!newProduct.title || !newProduct.desc || !newProduct.price) {
    return next(new AppError("please fill up all the fields", 400))
  }
  await newProduct.save()
  console.log(req.body.product.category)

  req.flash("success", "Successfully added a product!")
  return res.redirect("/admin/products")
}

module.exports.renderProductEditForm = async (req, res, next) => {
  const { id } = req.params
  const product = await Product.findById(id)

  if (!product) {
    req.flash("error", "Cannot find the product!")
  }
  res.render("admin/edit_adminproduct", { product })
}

module.exports.updateProduct = async (req, res, next) => {
  const { id } = req.params
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  })
  const imgs = req.files.map(({ path, filename }) => ({
    url: path,
    filename,
  }))
  product.images.push(...imgs)
  await product.save()

  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename)
    }
    await product.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    })
  }
  req.flash("success", "Successfully updated campground!")
  res.redirect("/admin/products")
}

module.exports.deleteProduct = async (req, res, next) => {
  const { id } = req.params
  const { images } = await Product.findByIdAndDelete(id)
  for (let i = 0; i < images.length; i++) {
    await cloudinary.uploader.destroy(images[i].filename)
  }
  res.redirect("/admin/products")
}
