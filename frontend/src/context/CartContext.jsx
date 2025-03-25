// src/utils/cartUtils.js

// Retrieve the visitor's cart from localStorage
export const getVisitorCart = () => {
    const cart = localStorage.getItem("visitorCart");
    return cart ? JSON.parse(cart) : [];
};

// Add an item to the visitor's cart
export const addToVisitorCart = (item) => {
    const cart = getVisitorCart();
    const existingItemIndex = cart.findIndex((cartItem) => cartItem.itemId === item.itemId);

    if (existingItemIndex !== -1) {
        // Update quantity if item already exists
        cart[existingItemIndex].quantity += item.quantity;
    } else {
        // Add new item
        cart.push(item);
    }

    localStorage.setItem("visitorCart", JSON.stringify(cart));
    return cart;
};

// Remove an item from the visitor's cart
export const removeFromVisitorCart = (itemId) => {
    const cart = getVisitorCart();
    const updatedCart = cart.filter((cartItem) => cartItem.itemId !== itemId);

    localStorage.setItem("visitorCart", JSON.stringify(updatedCart));
    return updatedCart;
};

// Update the quantity of an item in the visitor's cart
export const updateVisitorCartQuantity = (itemId, quantity) => {
    const cart = getVisitorCart();
    const updatedCart = cart.map((cartItem) => {
        if (cartItem.itemId === itemId) {
            return { ...cartItem, quantity }; // Update quantity
        }
        return cartItem;
    });

    localStorage.setItem("visitorCart", JSON.stringify(updatedCart));
    return updatedCart;
};

// Clear the visitor's cart
export const clearVisitorCart = () => {
    localStorage.removeItem("visitorCart");
};