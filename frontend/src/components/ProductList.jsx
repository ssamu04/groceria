import React from 'react';
import { PlusIcon } from 'lucide-react';
import ProductItem from './ProductItem';
import SearchProductModal from './SearchProductModal';

const ProductList = ({ products, listId, refreshList }) => (
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
                    <SearchProductModal onProductAdded={refreshList} />
                </dialog>
            </div>

            <ul className="list">
                {products.map(item => (
                    <ProductItem key={item._id} item={item} listId={listId} onProductRemoved={refreshList} />
                ))}
            </ul>
        </div>
    </div>
);

export default ProductList;