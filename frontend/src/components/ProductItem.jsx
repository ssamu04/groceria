import React from 'react';
import { Trash2Icon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/axios';

const ProductItem = ({ item, listId, onProductRemoved }) => {

    const removeProduct = async () => {
        try {
            await api.delete(`/groceria/${listId}/products/${item._id}`);
            toast.success("Product removed from list");
            onProductRemoved(item._id);
        } catch (err) {
            console.error("Error removing product:", err);
            toast.error("Failed to remove product");
        }
    };

    const updateProductPrice = async (newPrice) => {
        try {
            const res = await api.put(`/groceria/${listId}/products/${item._id}`, { price: Number(newPrice) });
            if (res.status >= 200 && res.status < 300) {
                toast.success("Product price updated");
            }
        } catch (err) {
            console.error("Error updating product price:", err);
            toast.error("Failed to update product price");
        }
    };

    return (
        <li className="list-row">
            <div>
                <img className="size-16 rounded-box" src={item.image_url || "/public/no-image.png"} alt={item.name} />
            </div>
            <div className="flex-1">
                <div className="text-xl">{item.name}</div>
                <div className="text-xs font-semibold opacity-60">Brand: {item.brand || "Unknown Brand"}</div>
                <input
                    type="number"
                    inputMode="decimal"
                    className="input mt-2 w-40"
                    placeholder="Enter price"
                    min="0"
                    defaultValue={item.price}
                    onBlur={(e) => {
                        const newPrice = Number(e.target.value);
                        if (newPrice !== item.price) updateProductPrice(newPrice);
                    }}
                />
            </div>
            <button className="btn btn-square btn-ghost" onClick={removeProduct}>
                <Trash2Icon className="size-4 text-error" />
            </button>
        </li>
    );
};

export default ProductItem;