import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Store, StoreModule } from '@ngrx/store';
import { cartReducer } from '@Ngrx/reducers/cart.reducer';
import { CacheService } from '@Services/cache.service';
import { Product } from '@Models/product.model';
import { Cart } from '@Models/cart.model';
import { addToCart, removeFromCart, clearCart, updateQuantity } from '@Ngrx/actions/cart.action';
import { of, first, lastValueFrom } from 'rxjs';

describe('CartService', () => {
    let cartService: CartService;
    let store: Store;
    let cacheService: CacheService;

    const mockProduct: Product = { id: 1, name: 'Adidas Yeezy', price: 999, image: 'adidas.jpg' };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot({ cart: cartReducer })],
            providers: [
                CartService,
                {
                    provide: CacheService,
                    useValue: {
                        saveCart: jest.fn(),
                        getCart: jest.fn(() => []),
                        clearCart: jest.fn()
                    }
                }
            ]
        });
        cartService = TestBed.inject(CartService);
        store = TestBed.inject(Store);
        cacheService = TestBed.inject(CacheService);

        // Spy on store dispatch and methods
        jest.spyOn(store, 'dispatch');
        jest.spyOn(cartService, 'updateProductQuantity');
        jest.spyOn(cartService, 'removeProductFromCart');
    });

    it('should be created', () => {
        expect(cartService).toBeTruthy();
    });

    it('should add a product to the cart and update cache', () => {
        cartService.addProductToCart(mockProduct);
        expect(store.dispatch).toHaveBeenCalledWith(addToCart({ product: mockProduct }));
        expect(cacheService.saveCart).toHaveBeenCalled();
    });

    it('should remove a product from the cart and update cache', () => {
        cartService.removeProductFromCart(mockProduct.id);
        expect(store.dispatch).toHaveBeenCalledWith(removeFromCart({ productId: mockProduct.id }));
        expect(cacheService.saveCart).toHaveBeenCalled();
    });

    it('should update product quantity and update cache', () => {
        cartService.updateProductQuantity(mockProduct.id, 2);
        expect(store.dispatch).toHaveBeenCalledWith(updateQuantity({ productId: mockProduct.id, change: 2 }));
        expect(cacheService.saveCart).toHaveBeenCalled();
    });

    it('should clear the cart and clear the cache', () => {
        cartService.clearCart();
        expect(store.dispatch).toHaveBeenCalledWith(clearCart());
        expect(cacheService.clearCart).toHaveBeenCalled();
    });

    it('should apply discount correctly', async () => {
        cartService.applyDiscount('SAVE10');
        let discount = await lastValueFrom(cartService.getDiscount().pipe(first()));
        expect(discount).toBe(10);
        cartService.applyDiscount('SAVE5');
        discount = await lastValueFrom(cartService.getDiscount().pipe(first()));
        expect(discount).toBe(5);
        cartService.applyDiscount('INVALID');
        discount = await lastValueFrom(cartService.getDiscount().pipe(first()));
        expect(discount).toBe(0);
    });

    it('should load cart from cache on initialization', () => {
        (cacheService.getCart as jest.Mock).mockReturnValue([{ product: mockProduct, quantity: 2 }]);
        const loadSpy = jest.spyOn(store, 'dispatch');
        cartService['loadCartFromCache']();
        expect(loadSpy).toHaveBeenCalledWith(addToCart({ product: mockProduct }));
        expect(loadSpy).toHaveBeenCalledWith(updateQuantity({ productId: mockProduct.id, change: 1 })); // Since quantity is 2, we adjust by 1
    });

    it('should sync cart data to cache', () => {
        const cartItems: Cart[] = [{ product: mockProduct, quantity: 2 }];
        jest.spyOn(store, 'select').mockReturnValue(of(cartItems));
        cartService['updateCache']();
        expect(cacheService.saveCart).toHaveBeenCalledWith(cartItems);
    });
});
