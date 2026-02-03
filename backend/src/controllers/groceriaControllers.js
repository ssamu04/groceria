import Grocery from "../model/Grocery.js"

export async function getAll (_, res) {
    try {
        const groceries = await Grocery.find().sort({ createdAt: -1 });
        res.status(200).json(groceries);
    } catch (error) {
        res.status(500).json({message: "Server Error" });
    }
}

export async function getGroceryById (req, res) {
    try {
        const { id } = req.params;
        const grocery = await Grocery.findById(id);
        if (!grocery) {
            return res.status(404).json({message: "Grocery item not found"});
        }
        res.status(200).json(grocery);
    } catch (error) {
        res.status(500).json({message: "Server Error" });
    }
}

export async function createItem (req, res) {
    try {
        const { name, description } = req.body;
        const newGrocery = new Grocery({ name, description });
        await newGrocery.save();
        res.status(201).json({message: "Grocery item created successfully", newGrocery});
    } catch (error) {
        res.status(500).json({message: "Server Error" });
    }
}

export async function updateItem (req, res) {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const updatedGrocery = await Grocery.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!updatedGrocery) {
            return res.status(404).json({message: "Grocery item not found"});
        }
        res.status(200).json({message: "Grocery item updated successfully", updatedGrocery});
    } catch (error) {
        res.status(500).json({message: "Server Error" });
    }
}

export const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedGrocery = await Grocery.findByIdAndDelete(id);
        if (!deletedGrocery) {
            return res.status(404).json({message: "Grocery item not found"});
        }
        res.status(200).json({message: "Grocery item deleted successfully", deletedGrocery});
    } catch (error) {
        res.status(500).json({message: "Server Error" });
    }
}