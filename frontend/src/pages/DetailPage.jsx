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

    useEffect(() => {
        const fetchGroceryList = async () => {
            try {
                const res = await api.get(`/groceria/${id}`);
                setGroceryList(res.data);
                setLastSavedData(res.data);
            } catch (err) {
                console.log("Error fetching grocery list", err);
                toast.error("Failed to fetch grocery list");
            } finally {
                setLoading(false);
            }
        };
        fetchGroceryList();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this grocery list?")) return;
        try {
            await api.delete(`/groceria/${id}`);
            toast.success("Grocery list deleted");
            navigate("/");
        } catch (err) {
            console.log("Error deleting grocery list", err);
            toast.error("Failed to delete grocery list");
        }
    };

    const hasChanges = () => {
        return (
            !lastSavedData ||
            groceryList.name !== lastSavedData.name ||
            groceryList.description !== lastSavedData.description
        );
    };

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
            console.log("Error saving grocery list", err);
            toast.error("Failed to update grocery list");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-base-200 flex items-center justify-center'>
                <LoaderIcon className='size-10 text-primary animate-spin'/>
            </div>
        );
    }

    const inputProps = {
        onBlur: saveGroceryList,
        onKeyDown: (e) => e.key === "Enter" && (e.preventDefault(), saveGroceryList()),
    };

    const refreshGroceryList = async () => {
        try {
            const res = await api.get(`/groceria/${id}`);
            setGroceryList(res.data);
        } catch (err) {
            console.log("Error refreshing grocery list", err);
        }
    };

    const removeProduct = async (productId) => {
        try {
            await api.delete(`/groceria/${id}/products/${productId}`);
            setGroceryList(prevList => ({
                ...prevList,
                products: prevList.products.filter(item => item._id !== productId)
            }));
            toast.success("Product removed from list");
        } catch (err) {
            console.log("Error removing product", err);
            toast.error("Failed to remove product");
        }
    };

    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <Link to="/" className="btn btn-ghost">
                            <ArrowLeftIcon className="h-5 w-5" />
                            Back to Grocery Lists
                        </Link>
                        <button onClick={handleDelete} className="btn btn-error btn-outline">
                            <Trash2Icon className="h-5 w-5" />
                            Delete Grocery List
                        </button>
                    </div>

                    <div className="card bg-base-100">
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
                </div>

                <div className="max-w-2xl mx-auto mt-4">
                    <div className="card bg-base-100">
                        <div className="card-body">
                            <div className="flex items-center">
                                <h2 className="m-3 text-lg text-secondary tracking-wide">Products</h2>
                                <button
                                    className="btn btn-primary btn-outline" 
                                    onClick={()=>document.getElementById('search_products').showModal()}
                                >
                                    <PlusIcon className="h-5 w-5" />
                                    Add
                                </button>
                                <dialog id="search_products" className="modal">
                                    <SearchProductModal onProductAdded={refreshGroceryList} />
                                </dialog>
                            </div>
                                <ul className="list">
                                    {groceryList.products.map((item, index) => (
                                    <li className="list-row" key={item.id ?? index}>
                                        <div><img className="size-10 rounded-box" src={item.image_url || "/public/no-image.png"}/></div>
                                        <div>
                                        <div>{item.name}</div>
                                        <div className="text-xs font-semibold opacity-60">Brand: {item.brand || "Unknown Brand"}</div>
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
        </div>
    );
};

export default DetailPage;
