import { Component } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Cart } from '@Models/cart.model';
import { CartService } from '@Services/cart.service';
import { CartState } from '@Ngrx/reducers/cart.reducer';
import { removeFromCart, updateQuantity } from '@Ngrx/actions/cart.action';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRemove, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [NgbActiveModal],
})
export class CartComponent {
  faCancel = faRemove;
  faPlus = faPlus;
  faMinus = faMinus;
  cart$: Observable<Cart[]>;
  subtotal$: Observable<number>;
  discount$ = new BehaviorSubject<number>(0);
  grandTotal$: Observable<number>;
  discountCode = '';
  invalidDiscount = false;

  constructor(
    private store: Store<{ cart: CartState }>,
    private cartService: CartService,
    public activeModal: NgbActiveModal
  ) {
    this.cart$ = this.store.select((state) => state.cart.items);

    this.subtotal$ = this.cart$.pipe(
      map((items) => items.reduce((acc, item) => acc + item.quantity * item.product.price, 0))
    );

    this.cartService.getDiscount().subscribe((discount) => {
      this.discount$.next(discount);
      this.updateGrandTotal();
    });

    this.grandTotal$ = this.subtotal$.pipe(map((subtotal) => subtotal - this.discount$.getValue()));
  }

  updateQuantity(productId: number, change: number) {
    this.cartService.updateProductQuantity(productId, change);
  }

  removeItem(productId: number) {
    this.cartService.removeProductFromCart(productId);
  }

  applyDiscount(event: Event) {
    const input = event.target as HTMLInputElement;
    this.discountCode = input.value.trim();
    this.cartService.applyDiscount(this.discountCode);

    // Check if discount is valid
    this.cartService.getDiscount().subscribe((discount) => {
      this.invalidDiscount = discount === 0 && this.discountCode !== '';
    });
  }

  updateGrandTotal() {
    this.grandTotal$ = this.subtotal$.pipe(map((subtotal) => subtotal - this.discount$.getValue()));
  }
}
