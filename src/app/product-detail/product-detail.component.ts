import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../service/product.service';
import { DecimalPipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

interface Product {
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
}

@Component({
  selector: 'app-product-detail',
  imports: [DecimalPipe, CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],

})
export class ProductDetailComponent implements OnInit{
  product: Product | null = null;
  quantity: number = 1;
  selectedImage: string = '';
  loading: boolean = true;
  addedToCart: boolean = false;
  error: string = '';
  
  relatedProducts: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private productService: ProductService  // INJECT SERVICE
  ) {}

  ngOnInit(): void {
  this.route.params.subscribe(params => {
    const productId = +params['id'];
    if (isNaN(productId)) {
      console.error('❌ Invalid product ID in route:', params['id']);
      this.error = 'Invalid product ID.';
      this.loading = false;
      return;
    }
    this.loadProduct(productId);
  });
  
}


  // loadProduct(id: number): void {
  //   this.loading = true;
  //   this.error = '';
    
  //   console.log(`🔍 Fetching product with ID: ${id}`);
    
  //   // REAL API CALL
  //   this.productService.getProductById(id).subscribe({
  //     next: (data) => {
  //       console.log('✅ Product loaded successfully:', data);
  //       this.product = data;
  //       this.selectedImage = this.productService.getProductImageUrl(this.product.imageFile);

  //       this.loading = false;
        
  //       // Load related products
  //       this.loadRelatedProducts();
  //     },
  //     error: (error) => {
  //       console.error('❌ Error loading product:', error);
  //       this.error = `Failed to load product: ${error.message || 'Unknown error'}`;
  //       this.loading = false;
  //     }
  //   });
  // }
  loadProduct(id: number): void {
    // Reset state first
    this.product = null;
    this.selectedImage = '';
    this.relatedProducts = [];
    this.loading = true;
    
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.selectedImage = this.productService.getProductImageUrl(this.product);
        this.loading = false;
        
        this.cdr.detectChanges();  // ← FORCE UPDATE
        
        this.loadRelatedProducts();
      }
    });
  }

  loadRelatedProducts(): void {
    if (!this.product) return;
    
    console.log(`🔍 Fetching related products in category: ${this.product.categoryName}`);
    
    this.productService.getRelatedProducts(this.product.categoryName, this.product.id, 3).subscribe({
      next: (data) => {
        console.log('✅ Related products loaded:', data);
        this.relatedProducts = data;
      },
      error: (error) => {
        console.error('❌ Error loading related products:', error);
        // Don't show error to user, just log it
      }
    });
  }

  getImageUrl(product: Product | null): string {
    return this.productService.getProductImageUrl(product) || "https://placehold.co/600x400?text=No+Image";
  }

  incrementQuantity(): void {
    if (this.product && this.quantity < this.product.stockQuantity) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;

    console.log('🛒 Adding to cart:', {
      productId: this.product.id,
      name: this.product.name,
      quantity: this.quantity,
      price: this.product.price,
      total: this.product.price * this.quantity
    });
    
    this.addedToCart = true;
    setTimeout(() => {
      this.addedToCart = false;
    }, 2000);
  }
  goBack(): void {
    this.router.navigate(['/shopping']);
  }
formatDate(date?: Date): string {
  if (!date) return '';

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return 'Invalid Date';

  return parsedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  });
}



  getMediaTypeDisplay(): string {
  switch (this.product?.mediaType) {
    case 'Game':
      return 'Game';
    case 'Movie':
      return 'Movie';
    case 'TV_Series':
      return 'TV Series';
    default:
      return 'Unknown Media Type';
  }
}

}
