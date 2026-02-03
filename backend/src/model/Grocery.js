import mongoose from "mongoose";

const grocerySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
    // ,
    // price: {
    //     type: Number,
    //     required: true
    // }
}, { timestamps: true });

const Grocery = mongoose.model("Grocery", grocerySchema);
export default Grocery;