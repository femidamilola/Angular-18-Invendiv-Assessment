import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { Store } from '@ngrx/store';
import { CartService } from '@Services/cart.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CartState } from '@Ngrx/reducers/cart.reducer';
import { of, BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

// Mock Data
const mockCartItems = [
    { product: { id: 1, name: 'Nike Air Force', price: 100, image: 'nike_air_force.jpg' }, quantity: 2 },
    { product: { id: 2, name: 'Nike Air Jordan', price: 200, image: 'nike_air_jordan.jpg' }, quantity: 1 },
];

describe('CartComponent', () => {
    let component: CartComponent;
    let fixture: ComponentFixture<CartComponent>;
    let store: Store<{ cart: CartState }>;
    let cartService: CartService;

    beforeEach(async () => {
        const mockStore = {
            select: jest.fn(),
            dispatch: jest.fn(),
        };
        const mockCartService = {
            getDiscount: jest.fn().mockReturnValue(new BehaviorSubject<number>(0).asObservable()),
            applyDiscount: jest.fn(),
            addProductToCart: jest.fn(),
            removeProductFromCart: jest.fn(),
            updateProductQuantity: jest.fn(),
        };
        await TestBed.configureTestingModule({
            imports: [CommonModule],
            providers: [
                { provide: Store, useValue: mockStore },
                { provide: CartService, useValue: mockCartService },
                NgbActiveModal,
            ],
        }).compileComponents();
        store = TestBed.inject(Store);
        cartService = TestBed.inject(CartService);
        jest.spyOn(store, 'select').mockReturnValue(of(mockCartItems));
        fixture = TestBed.createComponent(CartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });


    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize cart$ with mock items', (done) => {
        component.cart$.subscribe(cart => {
            expect(cart.length).toBe(2);
            expect(cart[0].product.name).toBe('Nike Air Force');
            done();
        });
    });

    it('should calculate the correct subtotal', (done) => {
        component.subtotal$.subscribe(subtotal => {
            expect(subtotal).toBe(400);
            done();
        });
    });

    it('should remove an item from the cart', () => {
        const removeSpy = jest.spyOn(cartService, 'removeProductFromCart');
        component.removeItem(1);
        expect(removeSpy).toHaveBeenCalledWith(1);
    });

    it('should apply a discount when a valid code is entered', () => {
        const applyDiscountSpy = jest.spyOn(cartService, 'applyDiscount');
        const mockEvent = { target: { value: 'SAVE10' } } as unknown as Event;
        component.applyDiscount(mockEvent);
        expect(applyDiscountSpy).toHaveBeenCalledWith('SAVE10');
        expect(component.discountCode).toBe('SAVE10');
    });

    it('should update the grand total correctly when discount is applied', (done) => {
        component.discount$.next(10); // Mock discount value
        component.updateGrandTotal();
        component.grandTotal$.subscribe(grandTotal => {
            expect(grandTotal).toBe(390); // Subtotal (400) - Discount (10)
            done();
        });
    });

    it('should update quantity correctly', () => {
        const updateSpy = jest.spyOn(cartService, 'updateProductQuantity');
        component.updateQuantity(1, 1);
        expect(updateSpy).toHaveBeenCalledWith(1, 1);
    });
});
