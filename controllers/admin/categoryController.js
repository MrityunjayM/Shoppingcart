// const Product = require("../../models/admin_product")
const Category = require("../../models/category")

const AppError = require("../../controlError/AppError")

module.exports.getAllCategories = async (req, res, next) => {
  try {
    const category = await Category.find({})
    if (!category) throw new AppError("Oops!!!, Something went wrong", 500)
    res.render("admin/category", { category })
  } catch (e) {
    next(e)
  }
}

module.exports.renderCategoryForm = async (req, res) =>
  res.render("admin/add_category")

module.exports.addCategory = async (req, res, next) => {
  const newCategory = new Category(req.body)
  if (!newCategory.title) {
    return next(new AppError("Please fill all the fields.", 200))
  }
  await newCategory.save()
  res.redirect("/admin/categories")
}

module.exports.renderCategoryEditForm = async (req, res, next) => {
  const { id } = req.params
  const category = await Category.findById(id)
  res.render("admin/edit_category", { category })
}

module.exports.updateCategory = async (req, res, next) => {
  const { id } = req.params
  await Category.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  })
  res.redirect("/admin/categories")
}

module.exports.deleteCategory = async (req, res, next) => {
  const { id } = req.params
  await Category.findByIdAndDelete(id)
  res.redirect("/admin/categories")
}
