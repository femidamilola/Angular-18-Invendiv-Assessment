import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Product } from '@Models/product.model';
import { CartService } from '@Services/cart.service';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { CartState } from '@Ngrx/reducers/cart.reducer';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartComponent } from '@Components/cart/cart.component';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  cartCount$: Observable<number>;
  faCart = faCartShopping;
  @Output() cartToggle = new EventEmitter<boolean>();

  private allProducts: Product[] = [
    { id: 1, name: 'Nike Air Force', price: 760, image: 'nike_air_force.jpg' },
    { id: 2, name: 'Nike Air Jordan', price: 220, image: 'nike_air_jordan.jpg' },
    { id: 3, name: 'Adidas Yeezy', price: 140, image: 'adidas_yeezy.jpg' },
    { id: 4, name: 'Naked Wolf', price: 320.50, image: 'naked_wolf.jpg' },
    { id: 4, name: 'Reebok', price: 320.50, image: 'reebok.jpg' }
  ];

  private filteredProducts$ = new BehaviorSubject<Product[]>(this.allProducts);
  products$ = this.filteredProducts$.asObservable();

  constructor(private cartService: CartService, private store: Store<{ cart: CartState }>, private modalService: NgbModal) {
    this.cartCount$ = this.store.select(state => state.cart.items).pipe(
      map(items => items.length)
    );
  }

  filterProducts(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      const searchLower = input.value.toLowerCase();
      const filtered = this.allProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower)
      );
      this.filteredProducts$.next(filtered);
    }
  }

  addToCart(product: Product) {
    this.cartService.addProductToCart(product);
  }
  openCartModal() {
    this.modalService.open(CartComponent, { size: 'lg' });
  }
}
