// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

// Match your backend Product model
export interface Product {
  id: number;
  name: string;
  description: string;
  categoryName: string;
  mediaType: string;  // ProductMediaType enum
  format: string;     // ProductFormat enum
  price: number;
  stockQuantity: number;
  releaseDate: Date;
  publisher: string;
  ratingAge: string;
  imageFile: string;
  // Optional frontend-only fields
  // rating?: number;
  // reviewCount?: number;
}

export interface ProductCategory {
  id: number;
  name: string;
  description: string;
  products?: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Update this with your actual backend URL
  private apiUrl = environment.apiUrl || 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // ==================== ACTUAL BACKEND ENDPOINTS ====================

  /**
   * Get all product categories with products
   * GET /api/product
   * Returns: List<ProductCategory>
   */
  
  getProductCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${this.apiUrl}/product`);
  }

  /**
   * Get product by ID
   * GET /api/product/{id}
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/product/${id}`);
  }

  /**
   * Create a new product
   * POST /api/product
   */
  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/product`, product);
  }

  /**
   * Update product (full update)
   * PUT /api/product
   */
  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/api/product`, product);
  }

  /**
   * Partial update product (specific fields)
   * PATCH /api/product/{id}
   */
  partialUpdateProduct(id: number, updates: { [key: string]: any }): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/product/${id}`, updates);
  }

  /**
   * Delete product
   * DELETE /api/product/{id}
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/product/${id}`);
  }

  // ==================== HELPER METHODS (Frontend Only) ====================

  /**
   * Get all products (flattened from categories)
   */
  // product.service.ts
getAllProducts(): Observable<Product[]> {
  return new Observable(observer => {
    this.getProductCategories().subscribe({
      next: (categories) => {
        // flatten all products
        const allProducts: Product[] = [];
        categories.forEach(category => {
          if (category.products) {
            allProducts.push(...category.products);
          }
        });
        observer.next(allProducts);
        observer.complete();
      },
      error: (error) => observer.error(error)
    });
  });
}


  /**
   * Get products by category name (filter frontend)
   */
  getProductsByCategory(categoryName: string): Observable<Product[]> {
    return new Observable(observer => {
      this.getProductCategories().subscribe({
        next: (categories) => {
          const category = categories.find(cat => 
            cat.name && cat.name.toLowerCase() === categoryName.toLowerCase()
          );
          observer.next(category?.products || []);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }
	private cachedProducts: Product[] | null = null;
	
	getAllProductsCached(): Observable<Product[]> {
	  // If we already have products cached, return them immediately
	  if (this.cachedProducts) {
	    return of(this.cachedProducts);
	  }
	
	  // Otherwise, fetch from backend and cache the result
	  return new Observable(observer => {
	    this.getProductCategories().subscribe({
	      next: (categories) => {
	        const allProducts: Product[] = [];
	        categories.forEach(category => {
	          if (category.products) {
	            allProducts.push(...category.products);
	          }
	        });
	
	        this.cachedProducts = allProducts; // cache it
	        observer.next(allProducts);
	        observer.complete();
	      },
	      error: (error) => observer.error(error)
	    });
	  });
	}
  clearCache(): void {
    this.cachedProducts = null;
  }

  /**
   * Search products by name or description (filter frontend)
   */
  searchProducts(query: string): Observable<Product[]> {
    return new Observable(observer => {
      this.getAllProducts().subscribe({
        next: (products) => {
          const searchTerm = query.toLowerCase();
          const filtered = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.categoryName.toLowerCase().includes(searchTerm)
          );
          observer.next(filtered);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Filter products by price range (filter frontend)
   */
  filterProductsByPrice(minPrice: number, maxPrice: number): Observable<Product[]> {
    return new Observable(observer => {
      this.getAllProducts().subscribe({
        next: (products) => {
          const filtered = products.filter(product => 
            product.price >= minPrice && product.price <= maxPrice
          );
          observer.next(filtered);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Get products by format (PS5, PS4, XBOX, PC, etc.) - filter frontend
   */
  getProductsByFormat(format: string): Observable<Product[]> {
    return new Observable(observer => {
      this.getAllProducts().subscribe({
        next: (products) => {
          const filtered = products.filter(product => 
            product.format.toLowerCase() === format.toLowerCase()
          );
          observer.next(filtered);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
  /**
 * Get products by media type (Game, Movie, TV_Series) - filter frontend
 */
  getProductsByMediaType(mediaType: string): Observable<Product[]> {
    return new Observable(observer => {
      this.getAllProducts().subscribe({
        next: (products) => {
          const filtered = products.filter(product =>
            product.mediaType.toLowerCase() === mediaType.toLowerCase()
          );
          observer.next(filtered);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }


  /**
   * Get featured/popular products (first N products) - frontend only
   */
  getFeaturedProducts(limit: number = 6): Observable<Product[]> {
    return new Observable(observer => {
      this.getAllProducts().subscribe({
        next: (products) => {
          // Sort by stock quantity or rating (assuming higher stock = more popular)
          const sorted = products
            .sort((a, b) => b.stockQuantity - a.stockQuantity)
            .slice(0, limit);
          observer.next(sorted);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Get new releases (sort by release date) - frontend only
   */
  getNewReleases(limit: number = 6): Observable<Product[]> {
    return new Observable(observer => {
      this.getAllProducts().subscribe({
        next: (products) => {
          const sorted = products
            .sort((a, b) => {
              const dateA = new Date(a.releaseDate).getTime();
              const dateB = new Date(b.releaseDate).getTime();
              return dateB - dateA; // Most recent first
            })
            .slice(0, limit);
          observer.next(sorted);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Get related products (same category, exclude current product)
   */
  getRelatedProducts(categoryName: string, excludeProductId: number, limit: number = 4): Observable<Product[]> {
    return new Observable(observer => {
      this.getProductsByCategory(categoryName).subscribe({
        next: (products) => {
          const filtered = products
            .filter(p => p.id !== excludeProductId)
            .slice(0, limit);
          observer.next(filtered);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get product image URL
   */
  // product.service.ts
getProductImageUrl(product: Product | null): string {
  if (!product) {
    return 'https://placehold.co/600x400?text=No+Image';
  }
  // If backend already gives a full URL, trust it
  if (product.imageFile?.startsWith('http')) {
    return product.imageFile;
  }

  // If backend gave a filename, serve from assets
  if (product.imageFile) {
    return `app/assets/${product.imageFile}`; // or `app/assets/...` depending on your angular.json
  }

  // Default placeholder based on media type
  const placeholders: Record<string, string> = {
    Game: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
    Movie: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400',
    TV_Series: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400'
  };

  return placeholders[product.mediaType] || placeholders['Game'];
}




  /**
   * Format product price
   */
  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  /**
   * Check if product is in stock
   */
  isInStock(product: Product): boolean {
    return product.stockQuantity > 0;
  }

  /**
   * Check if product is low stock
   */
  isLowStock(product: Product, threshold: number = 5): boolean {
    return product.stockQuantity > 0 && product.stockQuantity <= threshold;
  }

  /**
   * Update stock quantity (useful after purchase)
   */
  updateStockQuantity(productId: number, newQuantity: number): Observable<Product> {
    return this.partialUpdateProduct(productId, { stockQuantity: newQuantity });
  }
}

// ==================== USAGE EXAMPLES ====================

/*
// In your component:

// 1. Get all product categories
this.productService.getProductCategories().subscribe(categories => {
  console.log('Categories:', categories);
});

// 2. Get specific product
this.productService.getProductById(1).subscribe(product => {
  console.log('Product:', product);
});

// 3. Create new product
const newProduct = {
  name: 'New Game',
  description: 'Description',
  categoryName: 'Action Games',
  mediaType: 'DIGITAL',
  format: 'PS5',
  price: 59.99,
  stockQuantity: 100,
  releaseDate: '2024-12-01',
  publisher: 'Publisher',
  ratingAge: 'M (17+)',
  imageFile: 'image.jpg'
};
this.productService.createProduct(newProduct).subscribe(created => {
  console.log('Created:', created);
});

// 4. Update product stock
this.productService.partialUpdateProduct(1, { stockQuantity: 50 }).subscribe(updated => {
  console.log('Updated:', updated);
});

// 5. Search products
this.productService.searchProducts('god of war').subscribe(results => {
  console.log('Search results:', results);
});

// 6. Get related products
this.productService.getRelatedProducts('Action Games', 1, 4).subscribe(related => {
  console.log('Related products:', related);
});
*/