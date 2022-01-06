const express = require("express");
const router = express.Router();
const Category = require("../../models/category");
const { isAdmin, isLoggedIn } = require("../../middlewares");
const AppError = require("../../controlError/AppError");
const wrapAsync = require("../../controlError/wrapasync");

router.get("/", isLoggedIn, isAdmin, wrapAsync(async (req, res, next) => {
    try {
        const category = await Category.find({});
        if(!category) throw new AppError("something went wrong", 500);
        res.render("admin/category", { category });
    }
    catch (e) {
        next(e);
    }
}));

router.get("/add-category", isLoggedIn, isAdmin, wrapAsync(async (req, res, next) => {
    res.render("admin/add_category");
}));

router.post("/add-category", isLoggedIn, isAdmin, async (req, res, next) => {
    const newCategory = new Category(req.body);
    if (!newCategory.title) {
        return next(new AppError("Please fill all the fields.", 200));
    }
    await newCategory.save();
    res.redirect("/admin/categories");
});

router.get("/edit-category/:id", isLoggedIn, isAdmin, wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    res.render("admin/edit_category", { category });
}));

router.put("/edit-category/:id", isLoggedIn, isAdmin, wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect("/admin/categories");

}));
router.get("/delete-category/:id", isLoggedIn, isAdmin, wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    res.redirect("/admin/categories");
}));

module.exports = router;