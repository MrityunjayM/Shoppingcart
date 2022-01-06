const router = require("express").Router();

const wrapAsync = require("../controlError/wrapasync");

const Cateogry = require("../models/category");
const Product = require("../models/admin_product");

router.get('/',
  wrapAsync(async (req, res) => {
    const categories = await Cateogry.find({});
    const products = await Product.find({});
    if (!products) req.flash("error", "No product available at the moment!!!");
    res.status(200).render("index", { products, categories });
  })
);

module.exports = router;