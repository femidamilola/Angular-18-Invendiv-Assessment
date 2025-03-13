import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { CartState } from '@Ngrx/reducers/cart.reducer';
import { addToCart, removeFromCart, clearCart, updateQuantity } from '@Ngrx/actions/cart.action';
import { Product } from '@Models/product.model';
import { CacheService } from '@Services/cache.service';
import { take } from 'rxjs/operators';
import { Cart } from '@Models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private discount$ = new BehaviorSubject<number>(0);

  constructor(private store: Store<{ cart: CartState }>, private cacheService: CacheService) {
    this.loadCartFromCache();
  }

  addProductToCart(product: Product) {
    this.store.dispatch(addToCart({ product }));
    this.updateCache();
  }

  removeProductFromCart(productId: number) {
    this.store.dispatch(removeFromCart({ productId }));
    this.updateCache();
  }

  updateProductQuantity(productId: number, change: number) {
    this.store.dispatch(updateQuantity({ productId, change }));
    this.store.select(state => state.cart.items).pipe(take(1)).subscribe(cartItems => {
      this.cacheService.saveCart(cartItems);
    });
  }

  clearCart() {
    this.store.dispatch(clearCart());
    this.cacheService.clearCart();
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

  private updateCache() {
    this.store.select(state => state.cart.items).pipe(take(1)).subscribe(cartItems => {
      this.cacheService.saveCart(cartItems.map(item => ({
        product: item.product,
        quantity: item.quantity
      })));
    });
  }

  private loadCartFromCache() {
    const cachedCart: Cart[] = this.cacheService.getCart();
    cachedCart.forEach(item => {
      this.store.dispatch(addToCart({ product: item.product })); // Add product
      this.store.dispatch(updateQuantity({ productId: item.product.id, change: item.quantity - 1 }));
    });
  }
}
