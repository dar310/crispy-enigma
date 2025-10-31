import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../model/product';
@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() showAddToCart: boolean = true;
  @Input() layout: 'grid' | 'list' = 'grid';
  
  @Output() addToCartClicked = new EventEmitter<Product>();

  isHovered: boolean = false;
  addedToCart: boolean = false;

  constructor(private router: Router) {}

  // Navigate to product detail page
  viewProduct(): void {
    this.router.navigate(['/product', this.product.id]);
  }

  // Add to cart
  addToCart(event: Event): void {
    event.stopPropagation(); // Prevent navigation when clicking add to cart
    
    if (!this.isInStock()) return;
    
    console.log('Adding to cart:', this.product.name);
    this.addToCartClicked.emit(this.product);
    
    // Show feedback
    this.addedToCart = true;
    setTimeout(() => {
      this.addedToCart = false;
    }, 1500);
  }

  // Get product image URL
  getImageUrl(): string {
    if (this.product.imageFile?.startsWith('http')) {
      return this.product.imageFile;
    }
    // Default placeholder based on media type
    const placeholders = {
      'Game': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
      'Movie': 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400',
      'TV_Series': 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400'
    };
    return "app/assets/"+this.product.imageFile || placeholders[this.product.mediaType as keyof typeof placeholders] || placeholders.Game;
  }
  // Check stock status
  isInStock(): boolean {
    return this.product.stockQuantity > 0;
  }

  isLowStock(): boolean {
    return this.product.stockQuantity > 0 && this.product.stockQuantity <= 5;
  }

  // Format price
  formatPrice(): string {
    return `₱${this.product.price.toFixed(2)}`;
  }

  // Get media type display text
  getMediaTypeDisplay(): string {
    const mediaTypeMap: { [key: string]: string } = {
      'Game': '🎮 Game',
      'Movie': '🎬 Movie',
      'TV_Series': '📺 TV Series'
    };
    return mediaTypeMap[this.product.mediaType] || this.product.mediaType;
  }

  // Get media type icon only
  getMediaTypeIcon(): string {
    const iconMap: { [key: string]: string } = {
      'Game': '🎮',
      'Movie': '🎬',
      'TV_Series': '📺'
    };
    return iconMap[this.product.mediaType] || '📦';
  }

  // Get media type class for styling
  getMediaTypeClass(): string {
    return this.product.mediaType.toLowerCase().replace('_', '-');
  }
}
