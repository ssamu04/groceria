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


export async function searchItem (req, res) {
    try {
        const { q, page = 1, page_size = 20, sort = "unique_scans_n" } = req.query;

        if (!q) {
            return res.status(400).json({ error: "Query parameter 'q' is required." });
        }
        const url = new URL("https://world.openfoodfacts.org/cgi/search.pl");

        url.searchParams.append("search_terms", q)
        url.searchParams.append("countries_tags", "en:philippines");
        url.searchParams.append("page", page);
        url.searchParams.append("page_size", page_size);
        url.searchParams.append("action", "process");
        url.searchParams.append("json", "1");
        url.searchParams.append("sort_by", sort);
        url.searchParams.append("fields", "product_name,brands,image_url,code,unique_scans_n");
        
        const apiRes = await fetch(url);

        if (!apiRes.ok) {
            throw new Error("Failed to fetch Open Food Facts data");
        }
        const data = await apiRes.json();

        const filteredProducts = data.products.filter(p =>
            (p.product_name && p.product_name.toLowerCase().includes(q.toLowerCase())) ||
            (p.brands && p.brands.toLowerCase().includes(q.toLowerCase()))
        );
        const total_pages = Math.ceil(filteredProducts.length / page_size);
        
        return res.status(200).json({
            success: true,
            page: Number(page),
            total_pages,
            count: filteredProducts.length,
            products: filteredProducts
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

