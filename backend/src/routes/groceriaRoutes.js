import express from "express"
import { createItem, deleteItem, getAll, getGroceryById, updateItem } from "../controllers/groceriaControllers.js";

const router = express.Router();

router.get("/", getAll)
router.get("/:id", getGroceryById)
router.post("/", createItem)
router.put("/:id", updateItem)
router.delete("/:id", deleteItem)


export default router