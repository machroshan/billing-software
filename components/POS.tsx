import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingCart, User, CreditCard, Smartphone, Banknote } from 'lucide-react';
import { Product, Customer, CartItem, Transaction } from '../types';

interface POSProps {
  products: Product[];
  customers: Customer[];
  onUpdateProduct: (product: Product) => void;
  onAddTransaction: (transaction: Transaction) => void;
}

export default function POS({ products, customers, onUpdateProduct, onAddTransaction }: POSProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm)
  );

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert('Product out of stock!');
      return;
    }

    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert('Not enough stock available!');
        return;
      }
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1, discount: 0 }]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (product && newQuantity > product.stock) {
      alert('Not enough stock available!');
      return;
    }

    setCart(cart.map(item =>
      item.product.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateDiscount = (productId: string, discount: number) => {
    setCart(cart.map(item =>
      item.product.id === productId
        ? { ...item, discount: Math.max(0, Math.min(100, discount)) }
        : item
    ));
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => {
      const itemTotal = item.product.price * item.quantity;
      const discountAmount = (itemTotal * item.discount) / 100;
      return sum + (itemTotal - discountAmount);
    }, 0);

    const gstAmount = cart.reduce((sum, item) => {
      const itemTotal = item.product.price * item.quantity;
      const discountAmount = (itemTotal * item.discount) / 100;
      const taxableAmount = itemTotal - discountAmount;
      return sum + (taxableAmount * item.product.gst) / 100;
    }, 0);

    const total = subtotal + gstAmount;

    return { subtotal, gstAmount, total };
  };

  const processPayment = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    const { subtotal, gstAmount, total } = calculateTotals();
    const totalDiscount = cart.reduce((sum, item) => {
      const itemTotal = item.product.price * item.quantity;
      return sum + (itemTotal * item.discount) / 100;
    }, 0);

    const transaction: Transaction = {
      id: Date.now().toString(),
      items: [...cart],
      customer: selectedCustomer || undefined,
      subtotal,
      gstAmount,
      discount: totalDiscount,
      total,
      paymentMethod,
      timestamp: new Date(),
      invoiceNumber: `INV-${Date.now()}`
    };

    // Update product stock
    cart.forEach(item => {
      const updatedProduct = {
        ...item.product,
        stock: item.product.stock - item.quantity
      };
      onUpdateProduct(updatedProduct);
    });

    onAddTransaction(transaction);
    setCart([]);
    setSelectedCustomer(null);
    alert('Payment processed successfully!');
  };

  const { subtotal, gstAmount, total } = calculateTotals();

  // Handle barcode scanning (simulated with Enter key)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && searchTerm) {
        const product = products.find(p => p.barcode === searchTerm);
        if (product) {
          addToCart(product);
          setSearchTerm('');
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [searchTerm, products]);

  return (
    <div className="flex h-full bg-gray-50">
      {/* Product Search & Selection */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-md p-6 h-full">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products or scan barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  product.stock <= 0
                    ? 'bg-gray-100 border-gray-300'
                    : product.stock <= product.minStock
                    ? 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100'
                    : 'bg-white border-gray-200 hover:bg-blue-50'
                }`}
                onClick={() => addToCart(product)}
              >
                <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">₹{product.price}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className={`${product.stock <= product.minStock ? 'text-orange-600' : 'text-gray-600'}`}>
                    Stock: {product.stock}
                  </span>
                  <span className="text-gray-500">GST: {product.gst}%</span>
                </div>
                {product.stock <= 0 && (
                  <div className="mt-2 text-red-600 text-sm font-medium">Out of Stock</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart & Checkout */}
      <div className="w-96 p-6">
        <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <ShoppingCart className="mr-2" size={24} />
              Cart ({cart.length})
            </h2>
            <button
              onClick={() => setShowCustomerModal(true)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <User size={16} className="mr-1" />
              {selectedCustomer ? selectedCustomer.name : 'Add Customer'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mb-4">
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Cart is empty
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.product.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{item.product.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="font-medium">₹{item.product.price * item.quantity}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <label className="text-xs text-gray-600">Discount %:</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.discount}
                        onChange={(e) => updateDiscount(item.product.id, Number(e.target.value))}
                        className="w-16 px-1 py-1 text-xs border rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <>
              <div className="border-t pt-4 mb-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST:</span>
                    <span>₹{gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Payment Method:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'cash', icon: Banknote, label: 'Cash' },
                    { value: 'card', icon: CreditCard, label: 'Card' },
                    { value: 'upi', icon: Smartphone, label: 'UPI' }
                  ].map(({ value, icon: Icon, label }) => (
                    <button
                      key={value}
                      onClick={() => setPaymentMethod(value as any)}
                      className={`flex flex-col items-center p-2 rounded-lg border ${
                        paymentMethod === value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={20} className="mb-1" />
                      <span className="text-xs">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={processPayment}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Process Payment
              </button>
            </>
          )}
        </div>
      </div>

      {/* Customer Selection Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Select Customer</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setSelectedCustomer(null);
                  setShowCustomerModal(false);
                }}
                className="w-full text-left p-2 rounded hover:bg-gray-100"
              >
                Walk-in Customer
              </button>
              {customers.map(customer => (
                <button
                  key={customer.id}
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setShowCustomerModal(false);
                  }}
                  className="w-full text-left p-2 rounded hover:bg-gray-100"
                >
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-sm text-gray-600">{customer.phone}</div>
                  <div className="text-xs text-blue-600">Points: {customer.loyaltyPoints}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCustomerModal(false)}
              className="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}