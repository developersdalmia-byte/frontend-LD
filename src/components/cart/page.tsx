"use client";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, totalPrice, updateQty, removeFromCart } = useCart();

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-3xl mb-8">Your Cart</h1>

      {items.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {items.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="flex justify-between border-b pb-4 mb-4"
            >
              <div>
                <p>{item.name}</p>
                <p>Size: {item.size}</p>
                <p>Qty: {item.quantity}</p>

                <div className="flex gap-2 mt-2">
                  <button onClick={() => updateQty(item.id, item.size, 1)}>+</button>
                  <button onClick={() => updateQty(item.id, item.size, -1)}>-</button>
                  <button onClick={() => removeFromCart(item.id, item.size)}>
                    Remove
                  </button>
                </div>
              </div>

              <p>{item.price}</p>
            </div>
          ))}

          <h2 className="text-xl mt-6">Total: ₹{totalPrice}</h2>
        </>
      )}
    </div>
  );
}