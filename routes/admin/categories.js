const router = require("express").Router()

const { isAdmin, isLoggedIn } = require("../../middlewares")
const wrapAsync = require("../../controlError/wrapasync")

const {
  getAllCategories,
  renderCategoryForm,
  addCategory,
  renderCategoryEditForm,
  updateCategory,
  deleteCategory,
} = require("../../controllers/admin/categoryController")

router.get("/", isLoggedIn, isAdmin, wrapAsync(getAllCategories))

router
  .route("/add-category")
  .get(isLoggedIn, isAdmin, wrapAsync(renderCategoryForm))
  .post(isLoggedIn, isAdmin, wrapAsync(addCategory))

router
  .route("/edit-category/:id")
  .get(isLoggedIn, isAdmin, wrapAsync(renderCategoryEditForm))
  .put(isLoggedIn, isAdmin, wrapAsync(updateCategory))

router.get(
  "/delete-category/:id",
  isLoggedIn,
  isAdmin,
  wrapAsync(deleteCategory)
)

module.exports = router
