import { createReducer, on } from '@ngrx/store';
import { addToCart, removeFromCart, clearCart, updateQuantity } from '@Ngrx/actions/cart.action';
import { Cart } from '@Models/cart.model';

export interface CartState {
    items: Cart[];
}

const initialState: CartState = {
    items: [],
};

export const cartReducer = createReducer(
    initialState,
    on(addToCart, (state, { product }) => {
        const existingItem = state.items.find(item => item.product.id === product.id);

        const updatedItems = existingItem
            ? state.items.map(item =>
                item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 } // Increment if already exists
                    : item
            )
            : [...state.items, { product, quantity: 1 }]; // Otherwise, add new item

        return { ...state, items: updatedItems };
    }),

    on(removeFromCart, (state, { productId }) => ({
        ...state,
        items: state.items.filter(item => item.product.id !== productId),
    })),

    on(clearCart, state => ({ ...state, items: [] })),

    on(updateQuantity, (state, { productId, change }) => {
        return {
            ...state,
            items: state.items.map(item =>
                item.product.id === productId
                    ? { ...item, quantity: Math.max(1, item.quantity + change) } // Ensure it doesn't go below 1
                    : item
            ),
        };
    })
);
