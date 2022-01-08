const Product = require("../../models/admin_product")
const Category = require("../../models/category")

const AppError = require("../../controlError/AppError")
const { cloudinary } = require("../../cloudinary")

module.exports.getAllProducts = async (req, res) => {
  const products = await Product.find({}).populate("category", "title")
  res.render("admin/products", { products })
}

module.exports.renderProductForm = async (req, res) => {
  const desc = ""
  const price = ""
  const categories = await Category.find({})
  res.render("admin/add_product", { desc, price, categories })
}

module.exports.addProduct = async (req, res, next) => {
  const { title, desc, price, category } = req.body.product
  const cate = await Category.findOne({ title: category })
  const newProduct = new Product({ title, desc, price })
  newProduct.category = cate
  newProduct.images = req.files.map(({ path, filename }) => ({
    url: path,
    filename,
  }))
  cate.products.push(newProduct)
  console.log(newProduct)
  if (!newProduct.title || !newProduct.desc || !newProduct.price) {
    return next(new AppError("Please fill up all the fields!!!", 400))
  }

  await cate.save()
  await newProduct.save()

  req.flash("success", "Successfully added a product!")
  res.redirect("/admin/products")
}

module.exports.renderProductEditForm = async (req, res) => {
  const { id } = req.params
  const product = await Product.findById(id)

  if (!product) {
    req.flash("error", "Cannot find the product!")
  }
  res.render("admin/edit_adminproduct", { product })
}

module.exports.updateProduct = async (req, res) => {
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

module.exports.deleteProduct = async (req, res) => {
  const { id } = req.params
  const { images } = await Product.findByIdAndDelete(id)
  for (let i = 0; i < images.length; i++) {
    await cloudinary.uploader.destroy(images[i].filename)
  }
  res.redirect("/admin/products")
}
