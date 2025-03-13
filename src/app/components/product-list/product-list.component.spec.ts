import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { CartService } from '@Services/cart.service';
import { Store, StoreModule } from '@ngrx/store';
import { cartReducer } from '@Ngrx/reducers/cart.reducer';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartComponent } from '@Components/cart/cart.component';
import { By } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('ProductListComponent', () => {
    let component: ProductListComponent;
    let fixture: ComponentFixture<ProductListComponent>;
    let cartService: CartService;
    let store: Store;
    let modalService: NgbModal;

    const mockProducts = [
        { id: 1, name: 'Nike Air Force', price: 760, image: 'nike_air_force.jpg' },
        { id: 2, name: 'Nike Air Jordan', price: 220, image: 'nike_air_jordan.jpg' },
        { id: 3, name: 'Adidas Yeezy', price: 140, image: 'adidas_yeezy.jpg' }
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StoreModule.forRoot({ cart: cartReducer }), FontAwesomeModule],
            providers: [
                CartService,
                {
                    provide: NgbModal,
                    useValue: {
                        open: jest.fn(),
                    },
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProductListComponent);
        component = fixture.componentInstance;
        cartService = TestBed.inject(CartService);
        store = TestBed.inject(Store);
        modalService = TestBed.inject(NgbModal);
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should display product list', () => {
        component.filterProducts({ target: { value: '' } } as any);
        component['filteredProducts$'].next(mockProducts);
        fixture.detectChanges(); // Trigger UI update
        const productElements = fixture.debugElement.queryAll(By.css('.animate-underline'));
        expect(productElements.length).toBe(mockProducts.length);
    });

    it('should filter products correctly', () => {
        const event = { target: { value: 'Nike' } } as unknown as Event;
        component.filterProducts(event);
        component.products$.subscribe(filteredProducts => {
            expect(filteredProducts.length).toBe(2);
            expect(filteredProducts[0].name).toContain('Nike');
        });
    });

    it('should call addToCart when clicking add to cart button', () => {
        jest.spyOn(cartService, 'addProductToCart');
        component.addToCart(mockProducts[0]);
        expect(cartService.addProductToCart).toHaveBeenCalledWith(mockProducts[0]);
    });

    it('should open cart modal when clicking cart icon', () => {
        jest.spyOn(modalService, 'open');
        component.openCartModal();
        expect(modalService.open).toHaveBeenCalledWith(CartComponent, { size: 'lg' });
    });
});
