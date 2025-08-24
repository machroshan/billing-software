export interface Product {
  id: string;
  name: string;
  barcode: string;
  price: number;
  stock: number;
  category: string;
  gst: number;
  minStock: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  loyaltyPoints: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  discount: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  customer?: Customer;
  subtotal: number;
  gstAmount: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'upi';
  timestamp: Date;
  invoiceNumber: string;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'cashier';
  email: string;
}