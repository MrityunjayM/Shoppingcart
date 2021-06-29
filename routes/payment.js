const express = require('express');
const router = express.Router();
const paypal = require("paypal-rest-sdk");
var total = 0;
var count = 0;
paypal.configure({
    "mode": "sandbox", // sandbox or live
    "client_id": "AZwr17epw-6vTwqtmMxEi6NR2NngRAjKdnTxK1D0aqBxpJc4eLo6IkO6vx9jR5CYuYPqRrVuBAKFwDuR",
    "client_secret": "EBRJWFcQ8GeHWTOauxt5P6JYzkbHJRLQMZiZrl5EhTc2Y0M7DDcqPxc7rlxkE-Hyu8Ct4OmxZUQzS9bp"
});


router.post('/pay', (req, res) => {
    total = parseInt(req.body.price);
    count = parseInt(req.body.quantity);
    console.log(req.body.price);
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {

                "items": [{


                    "name": "All",
                    "sku": "001",
                    "price": parseInt(req.body.price[i]),
                    "currency": "USD",
                    "quantity": parseInt(req.body.quantity[i])


                }]
            },

            "amount": {
                "currency": "USD",
                "total": parseInt(req.body.price) * parseInt(req.body.quantity)
            },
            "description": "Hat for the best team ever"
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });

});

router.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": total * count
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            res.send('Success');
        }
    });
});

router.get('/cancel', (req, res) => res.send('Cancelled'));


module.exports = router;