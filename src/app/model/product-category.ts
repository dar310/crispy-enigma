import { Product } from "./product";

export class ProductCategory {
    id: number = 0;
    name: string = '';
    description: string = '';
    products?: Product[];
}
