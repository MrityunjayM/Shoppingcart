const router = require("express").Router()
const wrapAsync = require("../../controlError/wrapasync")
const { isAdmin, isLoggedIn } = require("../../middlewares")
const multer = require("multer")
const { storage } = require('../../cloudinary')
const upload = multer({ storage })

const {
  getAllProducts,
  renderProductForm,
  addProduct,
  renderProductEditForm,
  updateProduct,
  deleteProduct,
} = require("../../controllers/adminControllers")

router.get("/", isLoggedIn, isAdmin, wrapAsync(getAllProducts))

router
  .route("/add-product")
  .get(isLoggedIn, isAdmin, wrapAsync(renderProductForm))
  .post(isLoggedIn, isAdmin, upload.array("image"), wrapAsync(addProduct))

router
  .route("/edit-product/:id")
  .get(isLoggedIn, isAdmin, wrapAsync(renderProductEditForm))
  .put(isLoggedIn, isAdmin, upload.array("image"), wrapAsync(updateProduct))
  
router.get('/edit-product/:id/delete', isLoggedIn, isAdmin, wrapAsync(deleteProduct))

module.exports = router;
