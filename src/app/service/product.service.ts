// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../model/product';
import { ProductCategory } from '../model/product-category';
import { BaseHttpService } from './base-http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseHttpService{
  // Update this with your actual backend URL
  private apiUrl = environment.apiUrl || 'http://localhost:8080';

  constructor(http: HttpClient) {
    super(http, '/product');
  }

  // ==================== HELPER METHODS (Frontend Only) ====================

  /**
   * Get all products (flattened from categories)
   */
  // product.service.ts
/** 🔸 Get all product categories (with products) */
  getProductCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${this.apiServerUrl}/product`);
  }

  getAllProducts(): Observable<Product[]> {
    return new Observable(observer => {
      this.getProductCategories().subscribe({
        next: (categories) => {
          const allProducts: Product[] = [];
          categories.forEach(cat => {
            if (cat.products) allProducts.push(...cat.products);
          });
          observer.next(allProducts);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  private cachedProducts: Product[] | null = null;
  getAllProductsCached(): Observable<Product[]> {
  if (this.cachedProducts) {
    // Return a shallow copy to trigger Angular's OnPush or default change detection
    return of([...this.cachedProducts]);
  }

  return new Observable(observer => {
    this.getAllProducts().subscribe({
      next: (products) => {
        this.cachedProducts = products;
        observer.next([...products]); // return clone
        observer.complete();
      },
      error: (err) => observer.error(err)
    });
  });
}


  clearCache(): void {
    this.cachedProducts = null;
  }
  searchProducts(query: string): Observable<Product[]> {
    return new Observable(observer => {
      this.getAllProducts().subscribe({
        next: (products) => {
          const q = query.toLowerCase();
          const filtered = products.filter(
            p => p.name.toLowerCase().includes(q) ||
                 p.description.toLowerCase().includes(q) ||
                 p.categoryName.toLowerCase().includes(q)
          );
          observer.next(filtered);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  /** Filter by price range */
  filterProductsByPrice(min: number, max: number): Observable<Product[]> {
    return new Observable(observer => {
      this.getAllProducts().subscribe({
        next: (products) => {
          observer.next(products.filter(p => p.price >= min && p.price <= max));
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  /** Filter by format (PS5, PC, etc.) */
  getProductsByFormat(format: string): Observable<Product[]> {
    return new Observable(observer => {
      this.getAllProducts().subscribe({
        next: (products) => {
          observer.next(products.filter(p => p.format.toLowerCase() === format.toLowerCase()));
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  /** Filter by media type (Game, Movie, etc.) */
  getProductsByMediaType(mediaType: string): Observable<Product[]> {
    return new Observable(observer => {
      this.getAllProducts().subscribe({
        next: (products) => {
          observer.next(products.filter(p => p.mediaType.toLowerCase() === mediaType.toLowerCase()));
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  /** Featured or popular items */
  getFeaturedProducts(limit = 6): Observable<Product[]> {
    return new Observable(observer => {
      this.getAllProducts().subscribe({
        next: (products) => {
          const sorted = products
            .sort((a, b) => b.stockQuantity - a.stockQuantity)
            .slice(0, limit);
          observer.next(sorted);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  /** Recently released */
  getNewReleases(limit = 6): Observable<Product[]> {
    return new Observable(observer => {
      this.getAllProducts().subscribe({
        next: (products) => {
          const sorted = products
            .sort((a, b) =>
              new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
            )
            .slice(0, limit);
          observer.next(sorted);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  /** 🔸 Get products by category name */
  getProductsByCategory(categoryName: string): Observable<Product[]> {
    return new Observable(observer => {
      this.getProductCategories().subscribe({
        next: (categories) => {
          const category = categories.find(cat => cat.name?.toLowerCase() === categoryName.toLowerCase());
          observer.next(category?.products || []);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }


  /** 🔸 Get related products (same category, exclude current) */
  getRelatedProducts(categoryName: string, excludeProductId: number, limit: number = 4): Observable<Product[]> {
    return new Observable(observer => {
      this.getProductsByCategory(categoryName).subscribe({
        next: (products) => {
          const filtered = products.filter(p => p.id !== excludeProductId).slice(0, limit);
          observer.next(filtered);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }
  getProductImageUrl(product: Product | null): string {
    if (!product) return "https://placehold.co/600x400?text=No+Image";

    // ✅ If backend already provides a full URL
    if (product.imageFile?.startsWith("http")) return product.imageFile;

    // ✅ Serve from Angular’s assets if it’s a filename only
    if (product.imageFile) return `app/assets/${product.imageFile}`;

    // ✅ Default placeholder per media type (game, movie, etc.)
    const placeholders: Record<string, string> = {
      Game: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400",
      Movie: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400",
      TV_Series: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400"
    };
    return placeholders[product.mediaType] || placeholders["Game"];
  }

  /** Format price for display */
  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  /** Stock helpers */
  isInStock(p: Product): boolean {
    return p.stockQuantity > 0;
  }

  isLowStock(p: Product, threshold = 5): boolean {
    return p.stockQuantity > 0 && p.stockQuantity <= threshold;
  }

  updateStockQuantity(id: number, newQuantity: number): Observable<Product> {
    return this.patch(id, { stockQuantity: newQuantity });
  }
}