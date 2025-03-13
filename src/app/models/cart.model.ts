import { Product } from "@Models/product.model";
export interface Cart {
    product: Product;
    quantity: number;
}