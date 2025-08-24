import React, { useState } from 'react';
import Header from './components/Header';
import POS from './components/POS';
import Inventory from './components/Inventory';
import Reports from './components/Reports';
import { useLocalStorage } from './hooks/useLocalStorage';
import { sampleProducts, sampleCustomers } from './data/sampleData';
import { Product, Customer, Transaction } from './types';

function App() {
  const [currentView, setCurrentView] = useState('pos');
  const [products, setProducts] = useLocalStorage<Product[]>('products', sampleProducts);
  const [customers] = useLocalStorage<Customer[]>('customers', sampleCustomers);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);

  const currentUser = {
    name: 'John Doe',
    role: 'cashier'
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts([...products, newProduct]);
  };

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([transaction, ...transactions]);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'pos':
        return (
          <POS
            products={products}
            customers={customers}
            onUpdateProduct={handleUpdateProduct}
            onAddTransaction={handleAddTransaction}
          />
        );
      case 'inventory':
        return (
          <Inventory
            products={products}
            onUpdateProduct={handleUpdateProduct}
            onAddProduct={handleAddProduct}
          />
        );
      case 'reports':
        return (
          <Reports
            transactions={transactions}
            products={products}
          />
        );
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        user={currentUser}
      />
      <main className="flex-1">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;