import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Cart } from '@Models/cart.model';
import { CartService } from '@Services/cart.service';
import { CartState } from '@Ngrx/reducers/cart.reducer';
import { removeFromCart } from '@Ngrx/actions/cart.action';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [NgbActiveModal]
})
export class CartComponent {
  cart$: Observable<Cart[]>;
  subtotal$: Observable<number>;
  discount$ = new BehaviorSubject<number>(0);
  grandTotal$: Observable<number>;
  discountCode = '';

  constructor(private store: Store<{ cart: CartState }>, private cartService: CartService, public activeModal: NgbActiveModal) {
    this.cart$ = this.store.select(state => state.cart.items);

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
    this.store.select(state => state.cart.items).subscribe(cartItems => {
      const updatedCart = cartItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + change) } // Prevents negative quantity
          : item
      );
      updatedCart.forEach(item => this.cartService.addProductToCart(item.product)); // Update via store
    });
  }

  removeItem(productId: number) {
    this.store.dispatch(removeFromCart({ productId }));
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
