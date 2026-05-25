import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function WatchImg({ src, alt }) {
  return <img src={src} alt={alt} className="w-full h-full object-contain" onError={e => { e.target.style.display = "none"; }} />;
}

function PaymentSuccess({ order, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-gradient-to-br from-green-400 to-emerald-500 px-6 py-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4">
            <svg width="40" height="40" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-white text-2xl font-black">Payment Successful!</h2>
          <p className="text-green-100 text-sm mt-1">Your order has been confirmed 🎉</p>
        </div>
        <div className="px-6 py-5">
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order ID</span>
              <span className="font-bold text-gray-800 text-xs font-mono">#{order?._id?.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Items</span>
              <span className="font-bold text-gray-800">{order?.items?.length} product{order?.items?.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Paid</span>
              <span className="font-black text-orange-500 text-base">₹{order?.total?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className="bg-green-100 text-green-600 font-bold text-xs px-2 py-0.5 rounded-full">Confirmed ✓</span>
            </div>
          </div>

          <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
            {order?.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                <img src={item.thumb} alt={item.name} className="w-10 h-10 rounded-xl object-cover bg-gray-100 flex-shrink-0" onError={e => e.target.style.display='none'}/>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700 line-clamp-1">{item.shortName || item.name}</p>
                  {item.color && <p className="text-[10px] text-gray-400">Color: {item.color}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-black text-gray-900">₹{(item.price * item.qty).toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400">Qty: {item.qty}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 text-center mb-4">🚚 Expected delivery in 3–5 business days</p>
          <button onClick={onClose} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-sm py-3.5 rounded-full transition-colors active:scale-95">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const { cartItems, cartOpen, setCartOpen, updateQty, removeItem, clearCart, totalItems, totalPrice } = useCart();
  const { user } = useAuth();
  const [checking, setChecking] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  const delivery = totalPrice >= 999 ? 0 : 99;
  const grandTotal = totalPrice + delivery;

  const handleCheckout = async () => {
    setChecking(true);
    try {
      const token = localStorage.getItem("fastrack_token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.id, name: item.name, shortName: item.shortName || item.name,
            price: item.price, oldPrice: item.oldPrice, discount: item.discount,
            thumb: item.thumb, color: item.color, qty: item.qty,
          })),
          subtotal: totalPrice, delivery, total: grandTotal,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Checkout failed");
      setSuccessOrder(data.order);
      clearCart();
      setCartOpen(false);
    } catch (err) {
      alert("Checkout failed: " + err.message);
    } finally {
      setChecking(false);
    }
  };

  return (
    <>
      {successOrder && <PaymentSuccess order={successOrder} onClose={() => setSuccessOrder(null)} />}

      <div className={`fixed inset-0 z-40 transition-opacity duration-300 ${cartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
        onClick={() => setCartOpen(false)} />

      <div className="fixed top-0 right-0 h-full z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out"
        style={{ width: "min(420px, 100vw)", transform: cartOpen ? "translateX(0)" : "translateX(100%)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span className="font-black text-gray-900 tracking-wide text-base">My Cart</span>
            {totalItems > 0 && <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{totalItems}</span>}
          </div>
          <button onClick={() => setCartOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center">
              <svg width="40" height="40" fill="none" stroke="#F47A20" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <div>
              <p className="font-black text-gray-800 text-lg">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-1">Add some watches to get started!</p>
            </div>
            <button onClick={() => setCartOpen(false)} className="mt-2 bg-orange-500 text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-orange-600 transition-colors">
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Free delivery bar */}
            <div className="px-5 py-3 bg-orange-50 border-b border-orange-100">
              {totalPrice >= 999 ? (
                <div className="flex items-center gap-2 text-xs text-green-600 font-semibold">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                  You've unlocked FREE delivery!
                </div>
              ) : (
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>Add <span className="font-bold text-orange-500">₹{(999 - totalPrice).toLocaleString()}</span> more for free delivery</span>
                    <span className="font-semibold">₹999</span>
                  </div>
                  <div className="w-full h-1.5 bg-orange-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (totalPrice / 999) * 100)}%` }}/>
                  </div>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
              {cartItems.map(item => (
                <div key={item.key} className="flex gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors bg-white group">
                  <div className="w-20 h-20 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden flex items-center justify-center p-1.5">
                    <WatchImg src={item.thumb} alt={item.shortName}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">{item.shortName || item.name}</p>
                    {item.color && <p className="text-xs text-gray-400 mt-0.5">Color: {item.color}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="text-sm font-black text-gray-900">₹{(item.price * item.qty).toLocaleString()}</span>
                        {item.discount && <span className="ml-1.5 text-xs text-orange-500 font-semibold">{item.discount}% off</span>}
                      </div>
                      <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                        <button onClick={() => item.qty === 1 ? removeItem(item.key) : updateQty(item.key, -1)}
                          className={`w-7 h-7 flex items-center justify-center text-sm font-bold transition-colors ${item.qty === 1 ? "hover:bg-red-50 hover:text-red-500" : "hover:bg-gray-100"}`}>
                          {item.qty === 1 ? <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/></svg> : "−"}
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-gray-700">{item.qty}</span>
                        <button onClick={() => updateQty(item.key, 1)} className="w-7 h-7 flex items-center justify-center text-sm font-bold hover:bg-gray-100 transition-colors">+</button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.key)} className="opacity-0 group-hover:opacity-100 self-start w-6 h-6 rounded-full hover:bg-red-50 flex items-center justify-center transition-all flex-shrink-0">
                    <svg width="12" height="12" fill="none" stroke="#ef4444" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-5 py-4 bg-white">
              <div className="flex flex-col gap-1.5 mb-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal ({totalItems} item{totalItems > 1 ? "s" : ""})</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Delivery</span>
                  <span className={delivery === 0 ? "text-green-500 font-semibold" : ""}>{delivery === 0 ? "FREE" : `₹${delivery}`}</span>
                </div>
                <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
              <button onClick={handleCheckout} disabled={checking}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-black text-sm py-3.5 rounded-full transition-colors active:scale-95 mb-2 flex items-center justify-center gap-2">
                {checking ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Processing...</> : "Proceed to Checkout →"}
              </button>
              <button onClick={() => setCartOpen(false)} className="w-full border border-gray-200 text-gray-600 font-semibold text-sm py-3 rounded-full hover:bg-gray-50 transition-colors">
                Continue Shopping
              </button>
              {cartItems.length > 0 && (
                <button onClick={clearCart} className="w-full mt-2 text-xs text-gray-400 hover:text-red-400 transition-colors py-1">Clear cart</button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}