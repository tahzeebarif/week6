import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, selectedColor, selectedSize, quantity) => {
    setCartItems((prevItems) => {
      // Unique key based on ID, color, and size
      const existingItemIndex = prevItems.findIndex(
        (item) => 
          item.id === product._id && 
          item.color === selectedColor && 
          item.size === selectedSize
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].qty += quantity;
        return updatedItems;
      } else {
        return [
          ...prevItems,
          {
            id: product._id,
            name: product.name,
            price: product.price, // Base price or variant price (passed correctly from PDP)
            image: product.image, // Current displayed image
            color: selectedColor,
            size: selectedSize,
            qty: quantity,
            variant: product.variants?.find(v => v.color === selectedColor) || null
          },
        ];
      }
    });
  };

  const removeFromCart = (id, color, size) => {
    setCartItems((prevItems) => 
      prevItems.filter(
        (item) => !(item.id === id && item.color === color && item.size === size)
      )
    );
  };

  const updateQty = (id, color, size, qty) => {
    if (qty < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.color === color && item.size === size
          ? { ...item, qty }
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  
  // Example tax and shipping
  const discount = 0; // Can be expanded for coupons
  const deliveryFee = subtotal > 0 ? 15 : 0;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal - discount + deliveryFee + tax;

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      totalItemsCount,
      subtotal,
      discount,
      deliveryFee,
      tax,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
};
