import express from 'express';
import { authUser } from '../middleware/authUser.js';
import {
    fetchCart,
    addToCart,
    removeItemFromCart,
    updateCartItemQuantity,
    clearCart,
} from '../controllers/cartController.js';

const router = express.Router();

// Cart Routes
router.get('/cart', authUser, fetchCart);
router.post('/cart/add', authUser, addToCart);
router.post('/cart/remove', authUser, removeItemFromCart);
router.post('/cart/update', authUser, updateCartItemQuantity);
router.post('/cart/clear', authUser, clearCart);

export default router;