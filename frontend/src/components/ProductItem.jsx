import React, { useEffect } from 'react';
import { Trash2Icon } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductItem = ({
    product,
    onRemove,           // optional: remove product
    onAddToCart,        // optional: add product to cart
    onPriceChange,      // optional: update price
    onQuantityChange    // optional: update quantity
}) => {

    const [price, setPrice] = React.useState(product.price);

    useEffect(() => {
        setPrice(product.price);
    }, [product.price]);

    const handleRemove = async () => {
        if (!onRemove) return;
        try {
            await onRemove(product.id || product._id);
        } catch (err) {
            console.error("Error removing product:", err);
            toast.error("Failed to remove product");
        }
    };

    const handleAddToCart = () => {
        if (onAddToCart) onAddToCart(product);
    };

    const handlePriceBlur = (e) => {
        if (!onPriceChange) return;

        const trimmed = String(price).trim();
        const numPrice = Number(trimmed);
        
        if (!trimmed || !Number.isFinite(numPrice) || numPrice < 0) {
            setPrice(product.price);
            return toast.error("Price must be a valid number");
        }

        if (numPrice !== product.price)
            onPriceChange(product.id || product._id, numPrice);
    };

    const handleQuantityBlur = (e) => {
        if (!onQuantityChange) return;
        const newQty = Number(e.target.value);
        if (newQty !== product.quantity) onQuantityChange(product.id || product._id, newQty);
    };

    return (
        <li className="list-row flex items-center gap-4">
            <div>
                <img
                    className="size-16 rounded-box"
                    src={product.image_url || "/public/no-image.png"}
                    alt={product.name}
                />
            </div>

            <div className="flex-1">
                <div className="text-xl">{product.name}</div>
                <div className="text-xs font-semibold opacity-60">Category: {product.brand || "Unknown"}</div>

                {onPriceChange && (
                    <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        value={price}
                        placeholder="Enter price"
                        className="input mt-2 w-40"
                        onChange={(e) => setPrice(e.target.value)}
                        onBlur={handlePriceBlur}
                    />
                )}

                {onQuantityChange && (
                    <input
                        type="number"
                        min="1"
                        defaultValue={product.quantity || 1}
                        placeholder="Quantity"
                        className="input mt-2 w-20"
                        onBlur={handleQuantityBlur}
                    />
                )}
            </div>

            <div className="flex flex-col gap-2">
                {onAddToCart && (
                    <button className="btn btn-sm btn-primary" onClick={handleAddToCart}>
                        Add to Cart
                    </button>
                )}

                {onRemove && (
                    <button className="btn btn-square btn-ghost" onClick={handleRemove}>
                        <Trash2Icon className="size-4 text-error" />
                    </button>
                )}
            </div>
        </li>
    );
};

export default ProductItem;