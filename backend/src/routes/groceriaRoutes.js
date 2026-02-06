import express from "express"
import { createList, deleteList, getAll, getGroceryById, searchItem, updateList, addProduct, getProductsFromList, removeProduct, updateProduct } from "../controllers/groceriaControllers.js";

const router = express.Router();

// Grocery list endpoints
router.get("/", getAll)
router.get("/search", searchItem)
router.get("/:id", getGroceryById)
router.post("/", createList)
router.put("/:id", updateList)
router.delete("/:id", deleteList)

// Product endpoints
router.post("/:groceryListId/products", addProduct)
router.get("/:groceryListId/products", getProductsFromList)
router.delete("/:groceryListId/products/:productId", removeProduct)
router.put("/:groceryListId/products/:productId", updateProduct)


export default router