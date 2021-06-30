const express = require("express");
const router = express.Router();
const Product = require("../models/admin_product");
const Page = require("../models/page");
const Categories = require("../models/category");
const User = require("../models/user");
const Cart = require("../models/cart");
const { isAdmin, isLoggedIn } = require("../middleware");
const { createCollection } = require("../models/admin_product");

router.get('/', (req, res) => {
    Product.find({})
    .then(product => {
        Page.find({})
        .then(page => {
            res.render('index', {
                page, product
            });
        })
        .catch(e => next(e));
    })
    .catch(e => next(e));
});

router.get("/:title", async (req, res) => {
    const title = req.params.title;
    // console.log(title);
    if (title == "products") {
        // res.writeHead(302, { location: '/' });
        Categories.find({})
        .then((category) => {
            Product.find({})
            .populate('images')
            .then(product => {
                Page.find({})
                .then(page =>{
                    // console.log(page, category, product);
                    res.render("all_product", {
                        category,
                        product,                    
                        page
                    });
                })
                .catch(e => next(e));
            })
            .catch(e => next(e));            
        })
        .catch(e => next(e));
    } else {
        Page.find({})
        .then(page =>{
            res.render("explanation", {
                page,
                title,
            });
        })
        .catch(e => next(e));
    }
});

// router.get("/products", (req, res) => {
//     Categories.find((err, category) => {
//         res.render("all_product", {
//             category,
//             product,
//             page
//         })
//     })
// })

router.get("/products/:id", async (req, res) => {

    Product.findById(req.params.id)
    .then(product => {
        Page.find({})
        .then(page => {
            res.render('show', {
                page, product
            });
        })
        .catch(e => next(e));
    })
    .catch(e => next(e));

    // const product = await Product.findById(req.params.id);
    // res.render("show", { product, page });
});

router.get("/cart/:id", isLoggedIn, async (req, res, next) => {
    var count = 0, addCart = 0
    // for going back to 
    const backURL = req.header('Referer') || '/';
    const product = await Product.findById(req.params.id);
    console.log(product);

    Cart.find({ userId: req.user._id })
        .then(cart => {
            // console.log(cart);
            if (cart) {
                // console.log(cart.length);
                cart.forEach(async (p) => {
                    // console.log(p);
                    if (p.products[0] == req.params.id) {
                        await Cart.findByIdAndUpdate(p._id,{
                            quantity: p.quantity + 1,
                            totalPrice: p.totalPrice + product.price
                        }, (err, result) => {
                                if (err) {
                                    console.log(err);
                                }
                                console.log("###", result);
                        });
                        // console.log("same added")
                        if (backURL == "http://localhost:3000/all/mycart") {
                            res.redirect(backURL || '/');
                        }
                        else {
                            res.redirect('/products/'+ req.params.id);
                        }
                    }
                })

                cart.forEach((p) => {
                    if (p.products[0] != req.params.id) {
                        count += 1;
                        if (count == cart.length) {
                            addCart = new Cart({ userId: req.user._id, products: [req.params.id], quantity: 1 });
                            addCart.totalPrice = product.price;
                            addCart.save()
                            .then(() => {
                                console.log("added new");
                                res.redirect(backURL);
                            })
                            .catch(err => next(err));
                        }
                    }

                })
            } else {
                console.log("balajee");

                addCart = new Cart({ userId: req.user._id, products: [req.params.id], quantity: 1 });
                addCart.totalPrice = product.price;

                console.log("mishra");

                addCart.save()
                .then(() => {
                    console.log("added");
                    res.send("okkkk")
                })
                .catch(err => next(err));
            }
        })
        .catch(err => next(err));            
});

router.get("/all/mycart", isLoggedIn, async (req, res) => {
    const total = 0;
    const qty = 0;
    Cart.find({ userId: req.user._id })
    .then(carts => {
        res.render("mycart", {
            carts,
            total,
            qty,
            page,
            product
        })
    })
    .catch(e => next(e));

});

router.get("/mycart/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const deletedCart = await Cart.findByIdAndDelete(id);
    res.redirect("/all/mycart");
});

router.get("/carts/:id", isLoggedIn, async (req, res) => {

    const backURL = req.header('Referer') || '/';
    const product = await Product.findById(req.params.id);
    // console.log(req.params.id);
    Cart.findOne({ userId: req.user._id })
    .then(async (cart) => {
        if (cart) {
            // console.log(cart.length);
            cart.forEach(async (p) => {
                if (p.products[0] == req.params.id) {
                    console.log(p.quantity);
                    if (p.quantity > 1) {
                        console.log("balajee");
                        await Cart.findByIdAndUpdate(p._id,{
                                quantity: p.quantity - 1,
                                totalPrice: p.totalPrice - product.price 
                            }, (err, result) => {
                                if (err) {
                                    next(err);
                                }
                                console.log(result);
                            });
                        // console.log("same added")
                        if (backURL == "http://localhost:3000/all/mycart") {
                            res.redirect(backURL);
                        } else {
                            res.send("okay")
                        }
                    }
                }
                console.log("balajee");
                const { id } = req.params;
                console.log(id);
                const deletedCart = await Cart.findByIdAndDelete(id);
                console.log(deletedCart);
                res.redirect("/all/mycart");
                // res.redirect(`/mycart/${req.params.id}`);
            });
        }
    })
    .catch(e => next(e));
});

module.exports = router;