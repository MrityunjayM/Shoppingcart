const express = require("express");
const router = express.Router();
const Product = require("../models/admin_product");
const Page = require("../models/page");
const Categories = require("../models/category");
const User = require("../models/user");
const Cart = require("../models/cart");
const { isAdmin, isLoggedIn } = require("../middleware");
const { createCollection } = require("../models/admin_product");


var product, page;
Product.find((err, pro) => {
    showProduct(pro);
})
function showProduct(pro) {
    product = pro
    // console.log(product[0].images);

}

Page.find((err, pages) => {
    showPage(pages);
})
function showPage(p) {
    page = p;
}





router.get('/', (req, res) => {

    // Page.find((err, page) => {
    //     // console.log(page)
    //     if (err)
    //         console.log(err);
    res.render('index', {
        page, product
    });
});





router.get("/:title", async (req, res) => {
    const title = await req.params.title;
    console.log(title);
    if (title === "products") {
        // res.writeHead(302, { location: '/' });
        Categories.find((err, category) => {
            res.render("all_product", {
                category,
                product,
                page

            })
        })

    }

    else {
        res.render("explanation", {
            page,
            title,
        });
    }

});


router.get("/products", (req, res) => {
    Categories.find((err, category) => {
        res.render("all_product", {
            category,
            product,
            page

        })
    })
})









router.get("/products/:id", async (req, res) => {

    const product = await Product.findById(req.params.id);
    res.render("show", { product, page });

});





router.get("/cart/:id", isLoggedIn, async (req, res, next) => {
    var count = 0, addCart = 0


    // for going back to 
    const backURL = req.header('Referer') || '/';
    const product = await Product.findById(req.params.id);

    Cart.findOne({ userId: req.user._id })
        .then((c) => {
            if (c) {

                Cart.find({ userId: req.user._id })
                    .then(cart => {
                        // console.log(cart);
                        if (cart) {
                            // console.log(cart.length);
                            cart.forEach(async (p) => {
                                // console.log(p);
                                if (p.products[0] == req.params.id) {
                                    await Cart.findByIdAndUpdate(p._id,
                                        { quantity: p.quantity + 1, totalPrice: p.totalPrice + product.price }, (err, result) => {

                                            if (err) {
                                                console.log(err);
                                            }
                                            // console.log("###", result);

                                        });
                                    // console.log("same added")
                                    if (backURL == "http://localhost:3000/all/mycart") {
                                        res.redirect(backURL);
                                    }
                                    else {
                                        res.send("okay")
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
                                                res.send("okkkk")
                                            })
                                            .catch(err => next(err));

                                    }
                                }

                            })
                        }

                        else {
                            console.log("balajee");
                        }


                    })

                    .catch(err => next(err))

            }

            else {

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


        .catch(err => next(err))


})




router.get("/all/mycart", isLoggedIn, async (req, res) => {
    const total = 0;
    const qty = 0;
    Cart.find({ userId: req.user._id })
        // const carts = await Cart.find({ userId: req.user._id });
        .then(carts => {
            res.render("mycart", {
                carts,
                page,
                product,
                total,
                qty

            })
        })
        .catch(e => next(e));

})




router.get("/mycart/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const deletedCart = await Cart.findByIdAndDelete(id);
    res.redirect("/all/mycart");
});






router.get("/carts/:id", isLoggedIn, async (req, res) => {

    const backURL = req.header('Referer') || '/';
    const product = await Product.findById(req.params.id);
    console.log(req.params.id);
    Cart.find({ userId: req.user._id })
        .then(async (cart) => {
            if (cart) {
                console.log(cart.length);
                cart.forEach(async (p) => {
                    if (p.products[0] == req.params.id) {
                        console.log(p.quantity);
                        if (p.quantity > 1) {
                            console.log("balajee");
                            await Cart.findByIdAndUpdate(p._id,
                                { quantity: p.quantity - 1, totalPrice: p.totalPrice - product.price }, (err, result) => {

                                    if (err) {
                                        console.log(err);
                                    }
                                    // console.log("###", result);

                                });
                            // console.log("same added")
                            if (backURL == "http://localhost:3000/all/mycart") {
                                res.redirect(backURL);
                            }
                            else {
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

                })
            }

        })
        .catch(e => next(e));
})



module.exports = router;
