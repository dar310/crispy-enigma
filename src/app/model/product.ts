export class Product {
    id: number=0;
    name: string='';
    description: string='';
    categoryName: string='';
    mediaType: string='';  // ProductMediaType enum
    format: string='';     // ProductFormat enum
    price: number=0.0;
    stockQuantity: number=0;
    releaseDate: Date=new Date();
    publisher: string='';
    ratingAge: string='';
    imageFile: string='';
}
