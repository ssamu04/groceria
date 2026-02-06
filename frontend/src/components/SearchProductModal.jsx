import React from 'react'
import { useEffect } from 'react';
import { PlusIcon, Search } from 'lucide-react';
import { useParams } from 'react-router';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const SearchProductModal = ({ onProductAdded }) => {
    const [term, setTerm] = React.useState('')
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);

    useEffect(() => {
        const dialog = document.getElementById("search_products");

        const handleOpen = () => {
            setTerm("");
            setSearchTerm("");
            setSearchResults([]);
        };

        dialog.addEventListener("close", handleOpen);

        return () => {
            dialog.removeEventListener("close", handleOpen);
        };
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!term) return;
        setSearchTerm(term);
        try {
            const res = await fetch(
                `https://fakestoreapi.com/products?limit=10`
            );
            const data = await res.json();
            console.log(data);
            setSearchResults(data);
        } catch (err) {
            console.error(err);
        }
    }

    const { id } = useParams();

    const addProduct = async (product) => {
        try {
            const payload = {
                name: product.title,
                brand: product.category || "Unknown Brand",
                price: 0,
                image_url: product.image || ""
            };

            await api.post(`/groceria/${id}/products`, payload);
            toast.success("Product added to list");
            setTerm("");
            setSearchTerm("");
            setSearchResults([]);
            onProductAdded?.();
        } catch (err) {
            console.error("Failed to add product", err);
            toast.error("Failed to add product");
        }
    };

  return (
    <div className="modal-box">
        <form method="dialog">
        <div className='flex justify-between items-center'>
            <Search className='mr-2 text-secondary'/>
            <input
                type="text"
                placeholder="Search for an item to add..."
                className="input input-success input-bordered w-full"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearch(e);
                    }
                }}
            />
            <button className="btn btn-sm btn-circle btn-ghost ml-2">✕</button>
        </div>
        </form>
        {searchTerm.length > 0 && (
            <div>
            <ul className="list">
            <li className="p-2 pb-2 text-xs opacity-60 tracking-wide">
                {searchTerm && <p className="mt-2 text-secondary">You searched for: {searchTerm}</p>}
            </li>
            {searchResults.map((item, index) => (
            <li className="list-row" key={item.id ?? index}>
                <div><img className="size-10 rounded-box" src={item.image || "/public/no-image.png"}/></div>
                <div>
                <div>{item.title}</div>
                <div className="text-xs uppercase font-semibold opacity-60">{item.category || "Unknown Brand"}</div>
                </div>
                <button className="btn btn-square btn-ghost" onClick={() => addProduct(item)}>
                <PlusIcon className="size-4" />
                </button>
            </li>
            ))}
            </ul>
        </div>
        )}

    </div>
  )
}

export default SearchProductModal