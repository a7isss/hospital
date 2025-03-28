import React, { createContext, useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { VisitorContext } from "./VisitorContext"; // Import VisitorContext

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
    const { visitorId } = useContext(VisitorContext); // Access visitorId from VisitorContext
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem("cart");
            return savedCart && visitorId === localStorage.getItem("visitorID")
                ? JSON.parse(savedCart)
                : [];
        } catch (e) {
            console.error("Cart parse error:", e);
            return [];
        }
    });

    const [totalPrice, setTotalPrice] = useState(() => {
        const savedPrice = localStorage.getItem("totalPrice");
        return savedPrice ? parseFloat(savedPrice) : 0; // Load initial totalPrice from localStorage
    });

    // Save cart data to localStorage
    const saveCartToLocalStorage = (cart, totalPrice) => {
        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.setItem("totalPrice", totalPrice.toString());
    };

    // Add an item to the cart
    const addToCart = (item) => {
        const existingItem = cart.find((cartItem) => cartItem.itemId === item.itemId);
        let updatedCart;
        if (existingItem) {
            // If item exists, increase its quantity
            updatedCart = cart.map((cartItem) =>
                cartItem.itemId === item.itemId
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            );
        } else {
            // Add new item to the cart
            updatedCart = [...cart, { ...item, quantity: 1 }];
        }

        const updatedTotalPrice = recalculateTotalPrice(updatedCart);
        setCart(updatedCart);
        setTotalPrice(updatedTotalPrice);
        saveCartToLocalStorage(updatedCart, updatedTotalPrice);
    };

    // Other cart functions (updateCartQuantity, removeFromCart, etc.) remain unchanged

    return (
        <CartContext.Provider
            value={{
                cart,
                totalPrice,
                addToCart,
                // Include other cart functions here
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
