import { Component } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Cart } from '@Models/cart.model';
import { Product } from '@Models/product.model';
import { CartService } from '@Services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  cart$: BehaviorSubject<Cart[]> = new BehaviorSubject<Cart[]>([
    { product: { id: 1, name: 'iPhone 14', price: 999, image: 'iphone14.png' }, quantity: 1 },
    { product: { id: 2, name: 'MacBook Pro', price: 1999, image: 'macbook.png' }, quantity: 2 },
    { product: { id: 3, name: 'AirPods Pro', price: 249, image: 'airpods.png' }, quantity: 1 }
  ]);

  subtotal$: Observable<number>;
  discount$ = new BehaviorSubject<number>(0);
  grandTotal$: Observable<number>;
  discountCode = '';

  constructor(private cartService: CartService) {
    this.subtotal$ = this.cart$.pipe(
      map(items => items.reduce((acc, item) => acc + item.quantity * item.product.price, 0))
    );

    this.cartService.getDiscount().subscribe(discount => {
      this.discount$.next(discount);
      this.updateGrandTotal();
    });

    this.grandTotal$ = this.subtotal$.pipe(
      map(subtotal => subtotal - this.discount$.getValue())
    );
  }

  updateQuantity(productId: number, change: number) {
    const updatedCart = this.cart$.getValue().map(item =>
      item.product.id === productId
        ? { ...item, quantity: Math.max(1, item.quantity + change) } // Ensure quantity doesn't go below 1
        : item
    );
    this.cart$.next(updatedCart);
    this.updateGrandTotal();
  }

  removeItem(productId: number) {
    const updatedCart = this.cart$.getValue().filter(item => item.product.id !== productId);
    this.cart$.next(updatedCart);
    this.updateGrandTotal();
  }

  applyDiscount(event: Event) {
    const input = event.target as HTMLInputElement;
    this.discountCode = input.value.trim();
    this.cartService.applyDiscount(this.discountCode);
  }

  updateGrandTotal() {
    this.grandTotal$ = this.subtotal$.pipe(
      map(subtotal => subtotal - this.discount$.getValue())
    );
  }
}
