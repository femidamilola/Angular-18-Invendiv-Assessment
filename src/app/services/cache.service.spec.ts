import { CacheService } from '@Services/cache.service';
import { Cart } from '@Models/cart.model';
import { environment } from '@Cache/environment.class';
describe('CacheService', () => {
  let cacheService: CacheService;
  const CART_KEY = environment.localStorageKey;

  beforeEach(() => {
    cacheService = new CacheService();

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  const mockCart: Cart[] = [
    { product: { id: 1, name: 'Nike Air Force', price: 760, image: 'nike_air_force.jpg' }, quantity: 1 },
    { product: { id: 2, name: 'Nike Air Jordan', price: 220, image: 'nike_air_jordan.jpg' }, quantity: 2 },
  ];

  it('should save cart data to localStorage', () => {
    cacheService.saveCart(mockCart);
    expect(localStorage.setItem).toHaveBeenCalledWith(CART_KEY, JSON.stringify(mockCart));
  });

  it('should retrieve cart data from localStorage', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(mockCart));
    const retrievedCart = cacheService.getCart();
    expect(localStorage.getItem).toHaveBeenCalledWith(CART_KEY);
    expect(retrievedCart).toEqual(mockCart);
  });

  it('should return an empty array if no cart data is found', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    const retrievedCart = cacheService.getCart();
    expect(retrievedCart).toEqual([]);
  });
  
  it('should clear cart data from localStorage', () => {
    cacheService.clearCart();
    expect(localStorage.removeItem).toHaveBeenCalledWith(CART_KEY);
  });
});
