import { createAction, props } from '@ngrx/store';
import { Product } from '@Models/product.model';

export const addToCart = createAction('[Cart] Add Product', props<{ product: Product }>());
export const removeFromCart = createAction('[Cart] Remove Product', props<{ productId: number }>());
export const clearCart = createAction('[Cart] Clear Cart');
export const updateQuantity = createAction(
    '[Cart] Update Quantity',
    props<{ productId: number; change: number }>()
);
