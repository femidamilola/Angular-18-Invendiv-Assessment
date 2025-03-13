import { createReducer, on } from '@ngrx/store';
import { addToCart, removeFromCart, clearCart } from '@Ngrx/actions/cart.action';
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
                item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            )
            : [...state.items, { product, quantity: 1 }];

        return { ...state, items: updatedItems };
    }),

    on(removeFromCart, (state, { productId }) => ({
        ...state,
        items: state.items.filter(item => item.product.id !== productId),
    })),

    on(clearCart, state => ({ ...state, items: [] }))
);
