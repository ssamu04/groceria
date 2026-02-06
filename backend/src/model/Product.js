import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image_url: {
        type: String,
        required: false
    }
    /*,
    barcode: {
        type: String,
        required: false
    }*/
});

const Product = mongoose.model("Product", productSchema);
export default Product;