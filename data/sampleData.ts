import { Product, Customer } from '../types';

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Rice - Basmati 1kg',
    barcode: '8901030875421',
    price: 120,
    stock: 50,
    category: 'Groceries',
    gst: 5,
    minStock: 10
  },
  {
    id: '2',
    name: 'Milk - Full Cream 1L',
    barcode: '8901030875422',
    price: 65,
    stock: 30,
    category: 'Dairy',
    gst: 5,
    minStock: 5
  },
  {
    id: '3',
    name: 'Bread - White Loaf',
    barcode: '8901030875423',
    price: 35,
    stock: 25,
    category: 'Bakery',
    gst: 5,
    minStock: 5
  },
  {
    id: '4',
    name: 'Cooking Oil - Sunflower 1L',
    barcode: '8901030875424',
    price: 140,
    stock: 20,
    category: 'Groceries',
    gst: 5,
    minStock: 8
  },
  {
    id: '5',
    name: 'Sugar - White 1kg',
    barcode: '8901030875425',
    price: 45,
    stock: 40,
    category: 'Groceries',
    gst: 5,
    minStock: 10
  },
  {
    id: '6',
    name: 'Tea - Premium 250g',
    barcode: '8901030875426',
    price: 180,
    stock: 15,
    category: 'Beverages',
    gst: 12,
    minStock: 5
  },
  {
    id: '7',
    name: 'Soap - Bathing Bar',
    barcode: '8901030875427',
    price: 25,
    stock: 60,
    category: 'Personal Care',
    gst: 18,
    minStock: 15
  },
  {
    id: '8',
    name: 'Biscuits - Digestive 200g',
    barcode: '8901030875428',
    price: 55,
    stock: 35,
    category: 'Snacks',
    gst: 12,
    minStock: 10
  }
];

export const sampleCustomers: Customer[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    phone: '9876543210',
    email: 'rajesh@email.com',
    address: '123 MG Road, Bangalore',
    loyaltyPoints: 150
  },
  {
    id: '2',
    name: 'Priya Sharma',
    phone: '9876543211',
    email: 'priya@email.com',
    address: '456 Park Street, Mumbai',
    loyaltyPoints: 75
  },
  {
    id: '3',
    name: 'Amit Patel',
    phone: '9876543212',
    loyaltyPoints: 200
  }
];