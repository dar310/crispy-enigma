import { Routes } from '@angular/router';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { HomepageComponent } from './homepage/homepage.component';

export const routes: Routes = [
    // { path: 'test', component: ProductDetailComponent },
    { path: '', component: HomepageComponent},
    { path: 'product/:id', component: ProductDetailComponent }

];
