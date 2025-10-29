import { Component, OnInit } from '@angular/core';
import { ProductCardComponent } from "../product-card/product-card.component";
import { Product, ProductService } from '../service/product.service';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-body',
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './main-body.component.html',
  styleUrl: './main-body.component.css',
})
export class MainBodyComponent implements OnInit {  // ← ADD 'implements OnInit'
  products: Product[] = [];
  loading = true;
  error = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router  // ← ADD Router if you need navigation tracking
  ) {}

  ngOnInit(): void {
    // Load products on init
    this.loadProducts();
    
    // Also reload when navigating back from product detail
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';
    
    this.productService.getAllProductsCached().subscribe({
      next: (products) => {
        this.products = [...products];
        this.shuffleProducts();
        this.loading = false;
        console.log('✅ Products loaded:', this.products.length);
      },
      error: (error) => {
        console.error('❌ Error loading products:', error);
        this.error = 'Failed to load products.';
        this.loading = false;
      }
    });
  }

  shuffleProducts(): void {
    for (let i = this.products.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.products[i], this.products[j]] = [this.products[j], this.products[i]];
    }
  }

  // Get random subset of products (for homepage)
  getRandomProducts(count: number = 8): Product[] {
    const shuffled = [...this.products];
    this.shuffleArray(shuffled);
    return shuffled.slice(0, count);
  }

  private shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  onAddToCart(product: Product): void {
    console.log('🛒 Adding to cart:', product.name);
    // TODO: Implement cart service
    // For now, just show an alert
    alert(`Added "${product.name}" to cart!`);
  }

  // Retry loading products
  retryLoad(): void {
    this.loadProducts();
  }
}