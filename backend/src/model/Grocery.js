import mongoose from "mongoose";
import Product from "./Product.js";

const grocerySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    products: {
        type: [Product.schema],
        required: false,
        default: []
    }
    // ,
    // price: {
    //     type: Number,
    //     required: true
    // }
}, { timestamps: true });

const Grocery = mongoose.model("Grocery", grocerySchema);
export default Grocery;