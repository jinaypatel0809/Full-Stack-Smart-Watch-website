import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // isLoggedIn check is done by caller (via useAuth), passed as param
  const addToCart = (product, selectedColor, qty = 1, isLoggedIn = false, onLoginRequired) => {
    if (!isLoggedIn) {
      if (onLoginRequired) onLoginRequired();
      return;
    }
    setCartItems(prev => {
      const key = `${product.id}-${selectedColor}`;
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, {
        key,
        id: product.id,
        name: product.name,
        shortName: product.shortName,
        price: product.price,
        oldPrice: product.oldPrice,
        discount: product.discount,
        thumb: product.thumb,
        color: selectedColor,
        qty,
      }];
    });
    setCartOpen(true);
  };

  const updateQty = (key, delta) => {
    setCartItems(prev =>
      prev.map(i => i.key === key ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    );
  };

  const removeItem = (key) => {
    setCartItems(prev => prev.filter(i => i.key !== key));
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartOpen, setCartOpen, addToCart, updateQty, removeItem, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}