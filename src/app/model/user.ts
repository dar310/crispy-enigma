export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER'
}
export class User {
    id: number=0;
    fName: string='';
    lName: string='';
    email: string='';
    contact_no: string='';
    address: string='';
    password: string=''; // optional for display
    role: UserRole=UserRole.CUSTOMER;
    birthdate: Date= new Date();
    created_at: Date= new Date();
}
