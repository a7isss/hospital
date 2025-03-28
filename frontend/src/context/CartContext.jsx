import React, { createContext, useState, useEffect, useContext } from "react";
import { VisitorContext } from "./VisitorContext";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
    const { visitorId } = useContext(VisitorContext);
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    // Calculate total price
    const recalculateTotalPrice = (cartItems) => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Load cart when visitorId changes
    useEffect(() => {
        if (!visitorId) return;

        try {
            const savedCart = localStorage.getItem(`cart_${visitorId}`);
            const savedPrice = localStorage.getItem(`totalPrice_${visitorId}`);

            setCart(savedCart ? JSON.parse(savedCart) : []);
            setTotalPrice(savedPrice ? parseFloat(savedPrice) : 0);
        } catch (error) {
            console.error("Error loading cart:", error);
        }
    }, [visitorId]);

    // Save cart when it changes
    useEffect(() => {
        if (!visitorId) return;

        try {
            localStorage.setItem(`cart_${visitorId}`, JSON.stringify(cart));
            localStorage.setItem(`totalPrice_${visitorId}`, totalPrice.toString());
        } catch (error) {
            console.error("Error saving cart:", error);
        }
    }, [cart, totalPrice, visitorId]);

    // Add item to cart
    const addToCart = (item) => {
        if (!visitorId || !item?.price || !item?.itemId) return;

        setCart((prevCart) => {
            const existingItem = prevCart.find((i) => i.itemId === item.itemId);
            const updatedCart = existingItem
                ? prevCart.map((i) =>
                    i.itemId === item.itemId ? { ...i, quantity: i.quantity + 1 } : i
                )
                : [...prevCart, { ...item, quantity: 1 }];

            const newTotalPrice = recalculateTotalPrice(updatedCart);
            setTotalPrice(newTotalPrice);
            return updatedCart;
        });
    };

    // Update item quantity
    const updateCartQuantity = (itemId, newQuantity) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.map((item) =>
                item.itemId === itemId ? { ...item, quantity: newQuantity } : item
            );
            setTotalPrice(recalculateTotalPrice(updatedCart));
            return updatedCart;
        });
    };

    // Remove item from cart
    const removeFromCart = (itemId) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.filter((item) => item.itemId !== itemId);
            setTotalPrice(recalculateTotalPrice(updatedCart));
            return updatedCart;
        });
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                totalPrice,
                addToCart,
                updateCartQuantity,
                removeFromCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
