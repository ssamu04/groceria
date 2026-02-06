import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeftIcon, LoaderIcon } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import api from '../lib/axios';
import ProductList from '../components/ProductList';

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
                console.error("Error fetching grocery list:", err);
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
            console.error("Error deleting grocery list:", err);
            toast.error("Failed to delete grocery list");
        }
    };

    const saveGroceryList = async () => {
        const now = Date.now();
        if (now - lastSaved < 3000) return toast("You can only save once every 3 seconds");
        if (!groceryList.name.trim() || !groceryList.description.trim()) return toast.error("Please add a name or description");

        if (groceryList.name === lastSavedData.name && groceryList.description === lastSavedData.description) return;

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

    if (loading) return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center">
            <LoaderIcon className="size-10 text-primary animate-spin" />
        </div>
    );

    const inputProps = {
        onBlur: saveGroceryList,
        onKeyDown: (e) => e.key === "Enter" && (e.preventDefault(), saveGroceryList()),
    };

    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto flex items-center justify-between mb-6">
                    <Link to="/" className="btn btn-ghost flex items-center gap-2">
                        <ArrowLeftIcon className="h-5 w-5" /> Back to Grocery Lists
                    </Link>
                    <button onClick={handleDelete} className="btn btn-error btn-outline flex items-center gap-2">
                        Delete Grocery List
                    </button>
                </div>

                <div className="max-w-2xl mx-auto card bg-base-100 mb-4">
                    <div className="card-body">
                        <div className="form-control mb-4 flex flex-col">
                            <label className="label mb-2">Name</label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                value={groceryList.name}
                                onChange={(e) => setGroceryList({ ...groceryList, name: e.target.value })}
                                {...inputProps}
                            />
                        </div>
                        <div className="form-control mb-4 flex flex-col">
                            <label className="label mb-2">Description</label>
                            <textarea
                                className="textarea textarea-bordered h-32 w-full"
                                value={groceryList.description}
                                onChange={(e) => setGroceryList({ ...groceryList, description: e.target.value })}
                                {...inputProps}
                            />
                        </div>
                        {saving && <p className="text-sm text-gray-500">Saving...</p>}
                    </div>
                </div>

                <ProductList products={groceryList.products} listId={id} refreshList={() => {
                    api.get(`/groceria/${id}`).then(res => setGroceryList(res.data));
                }} />
            </div>
        </div>
    );
};

export default DetailPage;