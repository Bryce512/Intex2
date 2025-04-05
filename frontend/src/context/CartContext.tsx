import { createContext, ReactNode, useState, useContext } from "react";
import { cartItem } from "../types/cartItem";

interface CartContextType {
  cart: cartItem[];
  addToCart: (item:cartItem) => void;
  removeFromCart: (item:cartItem) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({children}: {children:ReactNode}) => {
  const [cart, setCart] = useState<cartItem[]>([]);


  const addToCart = (item: cartItem) => {
    setCart((prevCart) => {    
      const existingItem = prevCart.find((x) => x.bookId === item.bookId);

      if (existingItem) {
        // Update quantity and totalPrice for existing items
        return prevCart.map((c) =>
          c.bookId === item.bookId
            ? { ...c, quantity: c.quantity + 1, totalPrice: c.bookPrice * (c.quantity + 1) }
            : c
        );
      } else {
        // Add a new item to the cart, ensuring it has the correct quantity
        return [...prevCart, { ...item, quantity: 1, totalPrice: item.bookPrice }];
      }
    });
  };

  const removeFromCart = (item: cartItem) => {
    setCart((prevCart) => prevCart.filter((c) => c.bookId !== item.bookId));
  }

  const clearCart = () => {
    setCart([]);
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Add this at the end of your file
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;