import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { CartState } from '@Ngrx/reducers/cart.reducer';
import { addToCart, removeFromCart, clearCart } from '@Ngrx/actions/cart.action';
import { Product } from '@Models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private discount$ = new BehaviorSubject<number>(0);

  constructor(private store: Store<{ cart: CartState }>) { }

  addProductToCart(product: Product) {
    this.store.dispatch(addToCart({ product }));
  }

  removeProductFromCart(productId: number) {
    this.store.dispatch(removeFromCart({ productId }));
  }

  clearCart() {
    this.store.dispatch(clearCart());
  }

  applyDiscount(code: string) {
    let discountValue = 0;
    if (code === 'SAVE10') discountValue = 10;
    if (code === 'SAVE5') discountValue = 5;
    this.discount$.next(discountValue);
  }

  getDiscount() {
    return this.discount$.asObservable();
  }
}
