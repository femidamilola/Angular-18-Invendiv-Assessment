import { Injectable } from '@angular/core';
import { Cart } from '@Models/cart.model';
import { environment } from '@Cache/environment.class';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private CART_KEY = environment.localStorageKey;

  constructor() { }

  /** Save cart items to localStorage (only if available) */
  saveCart(cart: Cart[]) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
    }
  }

  /** Retrieve cart items from localStorage (return empty array if unavailable) */
  getCart(): Cart[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const cartData = localStorage.getItem(this.CART_KEY);
      return cartData ? JSON.parse(cartData) : [];
    }
    return [];
  }

  /** Clear cart cache */
  clearCart() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.CART_KEY);
    }
  }
}
