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
        required: true, 
        default: 0,
        min: [0, "Price must be greater than or equal to 0"]
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