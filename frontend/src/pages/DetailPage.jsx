import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeftIcon, LoaderIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import api from '../lib/axios';
import SearchProductModal from '../components/SearchProductModal';

const DetailPage = () => {
    const [groceryList, setGroceryList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(0);
    const [lastSavedData, setLastSavedData] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch grocery list
    useEffect(() => {
        const fetchGroceryList = async () => {
            try {
                const res = await api.get(`/groceria/${id}`);
                setGroceryList(res.data);
                setLastSavedData(res.data);
            } catch (err) {
                console.error("Error fetching grocery list:", err);
                toast.error("Failed to fetch grocery list");
            } finally {
                setLoading(false);
            }
        };
        fetchGroceryList();
    }, [id]);

    // Delete grocery list
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this grocery list?")) return;
        try {
            await api.delete(`/groceria/${id}`);
            toast.success("Grocery list deleted");
            navigate("/");
        } catch (err) {
            console.error("Error deleting grocery list:", err);
            toast.error("Failed to delete grocery list");
        }
    };

    // Check if name or description changed
    const hasChanges = () => (
        !lastSavedData ||
        groceryList.name !== lastSavedData.name ||
        groceryList.description !== lastSavedData.description
    );

    // Save grocery list
    const saveGroceryList = async () => {
        const now = Date.now();

        if (now - lastSaved < 3000) {
            toast("You can only save once every 3 seconds");
            return;
        }
        if (!hasChanges()) return;

        if (!groceryList.name.trim() || !groceryList.description.trim()) {
            toast.error("Please add a name or description");
            return;
        }

        setSaving(true);
        try {
            await api.put(`/groceria/${id}`, groceryList);
            toast.success("Grocery list updated");
            setLastSaved(now);
            setLastSavedData({ ...groceryList });
        } catch (err) {
            console.error("Error saving grocery list:", err);
            toast.error("Failed to update grocery list");
        } finally {
            setSaving(false);
        }
    };

    // Refresh grocery list after adding products
    const refreshGroceryList = async () => {
        try {
            const res = await api.get(`/groceria/${id}`);
            setGroceryList(res.data);
        } catch (err) {
            console.error("Error refreshing grocery list:", err);
        }
    };

    // Remove product from list
    const removeProduct = async (productId) => {
        try {
            await api.delete(`/groceria/${id}/products/${productId}`);
            setGroceryList(prev => ({
                ...prev,
                products: prev.products.filter(p => p._id !== productId)
            }));
            toast.success("Product removed from list");
        } catch (err) {
            console.error("Error removing product:", err);
            toast.error("Failed to remove product");
        }
    };

    // Update product price, show toast only on success
    const updateProductPrice = async (productId, newPrice) => {
        try {
            const res = await api.put(`/groceria/${id}/products/${productId}`, { price: Number(newPrice) });
            if (res.status >= 200 && res.status < 300) {
                toast.success("Product price updated");
            }
        } catch (err) {
            console.error("Error updating product price:", err);
            toast.error("Failed to update product price");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <LoaderIcon className="size-10 text-primary animate-spin" />
            </div>
        );
    }

    // Shared props for input/textarea
    const inputProps = {
        onBlur: saveGroceryList,
        onKeyDown: (e) => e.key === "Enter" && (e.preventDefault(), saveGroceryList()),
    };

    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="max-w-2xl mx-auto flex items-center justify-between mb-6">
                    <Link to="/" className="btn btn-ghost flex items-center gap-2">
                        <ArrowLeftIcon className="h-5 w-5" /> Back to Grocery Lists
                    </Link>
                    <button onClick={handleDelete} className="btn btn-error btn-outline flex items-center gap-2">
                        <Trash2Icon className="h-5 w-5" /> Delete Grocery List
                    </button>
                </div>

                {/* Grocery List Info */}
                <div className="max-w-2xl mx-auto card bg-base-100 mb-4">
                    <div className="card-body">
                        <div className="form-control mb-4 flex flex-col">
                            <label className="label mb-2">
                                <span className="label-text">Name</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Grocery List name"
                                className="input input-bordered w-full"
                                value={groceryList.name}
                                onChange={(e) => setGroceryList({ ...groceryList, name: e.target.value })}
                                {...inputProps}
                            />
                        </div>
                        <div className="form-control mb-4 flex flex-col">
                            <label className="label mb-2">
                                <span className="label-text">Description</span>
                            </label>
                            <textarea
                                placeholder="Write your grocery list description here..."
                                className="textarea textarea-bordered h-32 w-full"
                                value={groceryList.description}
                                onChange={(e) => setGroceryList({ ...groceryList, description: e.target.value })}
                                {...inputProps}
                            />
                        </div>
                        {saving && <p className="text-sm text-gray-500">Saving...</p>}
                    </div>
                </div>

                {/* Products */}
                <div className="max-w-2xl mx-auto card bg-base-100">
                    <div className="card-body">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg text-secondary tracking-wide">Products</h2>
                            <button
                                className="btn btn-primary btn-outline flex items-center gap-2"
                                onClick={() => document.getElementById('search_products').showModal()}
                            >
                                <PlusIcon className="h-5 w-5" /> Add
                            </button>
                            <dialog id="search_products" className="modal">
                                <SearchProductModal onProductAdded={refreshGroceryList} />
                            </dialog>
                        </div>

                        <ul className="list">
                            {groceryList.products.map((item, index) => (
                                <li className="list-row" key={item._id || index}>
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
                                                if (newPrice !== item.price) updateProductPrice(item._id, newPrice);
                                            }}
                                        />
                                    </div>
                                    <button className="btn btn-square btn-ghost" onClick={() => removeProduct(item._id)}>
                                        <Trash2Icon className="size-4 text-error" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailPage;