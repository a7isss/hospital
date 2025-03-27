import React, { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
    const [visitorID, setVisitorID] = useState(() => {
        // Initialize visitorID from local storage or create a new one
        const storedVisitorID = localStorage.getItem("visitorID");
        if (storedVisitorID) {
            return storedVisitorID;
        } else {
            const newVisitorID = uuidv4(); // Generate unique visitor ID
            localStorage.setItem("visitorID", newVisitorID); // Persist in local storage
            return newVisitorID;
        }
    });

    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart && visitorID === localStorage.getItem("visitorID") ? JSON.parse(savedCart) : []; // Load initial cart if visitorID matches
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

    // Recalculate totalPrice whenever the cart changes
    const recalculateTotalPrice = (cart) => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
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

    // Update the quantity of an item in the cart
    const updateCartQuantity = (itemId, quantity) => {
        let updatedCart = cart.map((cartItem) =>
            cartItem.itemId === itemId ? { ...cartItem, quantity } : cartItem
        );

        // Remove the item if quantity is less than or equal to 0
        updatedCart = updatedCart.filter((cartItem) => cartItem.quantity > 0);

        const updatedTotalPrice = recalculateTotalPrice(updatedCart);
        setCart(updatedCart);
        setTotalPrice(updatedTotalPrice);
        saveCartToLocalStorage(updatedCart, updatedTotalPrice);
    };

    // Remove an item from the cart
    const removeFromCart = (itemId) => {
        const updatedCart = cart.filter((cartItem) => cartItem.itemId !== itemId);
        const updatedTotalPrice = recalculateTotalPrice(updatedCart);
        setCart(updatedCart);
        setTotalPrice(updatedTotalPrice);
        saveCartToLocalStorage(updatedCart, updatedTotalPrice);
    };
// Fetch the cart based on visitorID
    const fetchCart = async () => {
        const savedVisitorID = localStorage.getItem("visitorID");
        const savedCart = localStorage.getItem("cart");
        if (savedVisitorID === visitorID && savedCart) {
            setCart(JSON.parse(savedCart)); // Update the cart state
            setTotalPrice(recalculateTotalPrice(JSON.parse(savedCart))); // Recalculate total price
        } else {
            // If no cart is found or visitorID mismatch, reset the cart
            setCart([]);
            setTotalPrice(0);
        }
    };
    // Clear the cart
    const clearCart = () => {
        setCart([]);
        setTotalPrice(0);
        saveCartToLocalStorage([], 0);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                totalPrice,
                addToCart,
                updateCartQuantity,
                removeFromCart,
                clearCart,
                fetchCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};