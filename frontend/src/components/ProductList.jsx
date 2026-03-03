import React from 'react';
import { PlusIcon } from 'lucide-react';
import ProductItem from './ProductItem';
import SearchProductModal from './SearchProductModal';

const ProductList = ({
    products,
    onProductRemoved,    // optional callback for removing products
    onAddToCart,         // optional callback for adding product to cart
    onPriceChange,       // optional callback for price update
    onQuantityChange,    // optional callback for quantity update
    showAddButton = false, // whether to show the "Add Product" button (for Grocery List)
    refreshList          // optional callback to refresh products (for modal)
}) => (
    <div className="max-w-2xl mx-auto card bg-base-100">
        <div className="card-body">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg text-secondary tracking-wide">Products</h2>

                {showAddButton && (
                    <>
                        <button
                            className="btn btn-primary btn-outline flex items-center gap-2"
                            onClick={() => document.getElementById('search_products').showModal()}
                        >
                            <PlusIcon className="h-5 w-5" /> Add
                        </button>
                        <dialog id="search_products" className="modal">
                            <SearchProductModal onProductAdded={refreshList} />
                        </dialog>
                    </>
                )}
            </div>

            <ul className="list flex flex-col gap-2">
                {products.map((product) => (
                    <ProductItem
                        key={product._id || product.id}
                        product={product}
                        onRemove={onProductRemoved}
                        onAddToCart={onAddToCart}
                        onPriceChange={onPriceChange}
                        onQuantityChange={onQuantityChange}
                    />
                ))}
            </ul>
        </div>
    </div>
);

export default ProductList;