const router = require("express").Router()

const wrapAsync = require("../controlError/wrapasync")

const Cateogry = require("../models/category")

router.route("/:id").get(
  wrapAsync(async (req, res) => {
    const { id } = req.params
    const category = await Cateogry.findById(id).populate("products")
    // res.status(200).json(category)
    res.status(200).render("byCategory", { category })
  })
)

module.exports = router
