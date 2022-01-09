const express = require("express");
const router = express.Router();
const Product = require("../models/admin_product");
const Page = require("../models/page");
const Categories = require("../models/category");
const User = require("../models/user");
const Cart = require("../models/cart");
const { isLoggedIn } = require("../middleware");
// const { createCollection } = require("../models/admin_product");

router.get('/', async (req, res, next) => {

    try{
        const page = await Page.find({});
        const product = await Product.find({});
        if(typeof req.user == 'undefined'){ 
            res.render('index', {page, product});
        } else {
            const carts = await Cart.find({});
            res.render('index', {page, product, carts});
        }
    }
    catch(e){
        next(e);
    }
});

router.get("/:title", async (req, res, next) => {
    const title = req.params.title;

    if (title == "products") {
        Categories.find({})
        .then((category) => {
            Product.find({})
            .populate('images')
            .then(product => {
                Page.find({})
                .then(async (page) =>{
                    if(typeof req.user == 'undefined'){   
                        res.render("all_product", {
                            category,
                            product,                    
                            page
                        });
                    } else {
                        // console.log(req.user);
                        const carts = await Cart.find({});
                        res.render("all_product", {
                            category,
                            product,                    
                            page,
                            carts
                        });
                    }
                })
                .catch(e => next(e));
            })
            .catch(e => next(e));            
        })
        .catch(e => next(e));
    } else {
        const page = await Page.find({});
        if(typeof req.user == 'undefined'){   
            res.render("explanation", {                    
                page,
                title
            });
        } else {
            // console.log(req.user);
            const carts = await Cart.find({});
            res.render("explanation", {                    
                page,
                title,
                carts
            });
        }
    }
});

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
});

router.get("/cart/:id", isLoggedIn, async (req, res, next) => {

    var count = 0, addCart = 0

    // for going back to 
    const backURL = req.header('Referer');
    const product = await Product.findById(req.params.id);

    Cart.find({ userId: req.user._id })
        .then(cart => {
            if (cart.length > 0) {
                console.log('Before',cart);
                cart.forEach(p => {
                    if (p.products[0] == req.params.id) {
                        Cart.findByIdAndUpdate(cart[0]._id,{
                            quantity: p.quantity + 1,
                            totalPrice: p.totalPrice + product.price
                        })
                        .then(result => {
                            console.log("###", result);
                        },e => next(e))
                        .catch(e => next(e));

                        if (backURL == "http://localhost:3000/all/mycart") {
                            res.redirect(backURL);
                        }
                        else {
                            res.redirect('/products');
                        }

                    } else if( p.products[0] != req.params.id){
                        count += 1;
                        if (count == cart.length) {
                            addCart = new Cart({
                                userId: req.user._id,
                                products: [req.params.id],
                                quantity: 1 
                            });

                            addCart.totalPrice = product.price;
                            addCart.save()
                            .then(() => {
                                console.log("added new");
                                res.redirect(backURL);
                            })
                            .catch(err => next(err));
                        }
                    }
                });

            } else {
                console.log("balajee");

                addCart = new Cart({ userId: req.user._id, products: [req.params.id], quantity: 1 });
                addCart.totalPrice = product.price;

                console.log("mishra");

                addCart.save()
                .then(() => {
                    console.log("added");
                    res.redirect(backURL);
                })
                .catch(err => next(err));
            }
        })
        .catch(err => next(err));            
});

router.get("/all/mycart", isLoggedIn, async (req, res) => {
    const total = 0;
    const qty = 0;

    const product = await Product.find({});
    const page = await Page.find({});
    // const product = await Product.find({});
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