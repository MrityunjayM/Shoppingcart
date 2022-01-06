
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: [true, "Price should must be numeric value."]
    },
    category: {
        type: String,
        required: [ true, "Please select a category for this product." ]
    },
    slug: {
        type: String
    },
    images: [ImageSchema]
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;