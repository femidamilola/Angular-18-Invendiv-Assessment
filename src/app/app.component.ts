import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartComponent } from "@Components/cart/cart.component";
import { ProductListComponent } from "@Components/product-list/product-list.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CartComponent, ProductListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'retail-cart';
}
