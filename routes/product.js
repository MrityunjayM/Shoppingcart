const router = require("express").Router();

const wrapAsync = require("../controlError/wrapasync");

const Cateogry = require("../models/category");
const Product = require("../models/admin_product");

router.route("/").get(
  wrapAsync(async (req, res) => {
    const categories = await Cateogry.find({});
    const products = await Product.find({});
    if (!products) req.flash("error", "No product available at the moment!!!");
    res.status(200).render("all_product", { products, categories });
  })
);

router.route("/:id").get(
  wrapAsync(async (req, res) => {
    const { id: _id } = req.params;
    const product = await Product.findOne({ _id });
    if (!product) {
        req.flash("error", "Product not found!!!");
        return res.redirect('/products')
    }
    res.status(200).render("show", { product });
  })
);

module.exports = router;
