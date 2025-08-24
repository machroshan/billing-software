import React, { useState } from 'react';
import { Plus, Edit, AlertTriangle, Package } from 'lucide-react';
import { Product } from '../types';

interface InventoryProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
}

export default function Inventory({ products, onUpdateProduct, onAddProduct }: InventoryProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    price: '',
    stock: '',
    category: '',
    gst: '',
    minStock: ''
  });

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      barcode: formData.barcode,
      price: Number(formData.price),
      stock: Number(formData.stock),
      category: formData.category,
      gst: Number(formData.gst),
      minStock: Number(formData.minStock)
    };

    if (editingProduct) {
      onUpdateProduct({ ...editingProduct, ...productData });
    } else {
      onAddProduct({ id: Date.now().toString(), ...productData });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      barcode: '',
      price: '',
      stock: '',
      category: '',
      gst: '',
      minStock: ''
    });
    setShowAddModal(false);
    setEditingProduct(null);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      barcode: product.barcode,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      gst: product.gst.toString(),
      minStock: product.minStock.toString()
    });
    setShowAddModal(true);
  };

  return (
    <div className="p-4 bg-gray-200 min-h-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Purchase Management</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-3 py-2 hover:bg-blue-700 flex items-center text-sm"
          >
            <Plus size={20} className="mr-2" />
            Add Product
          </button>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-400 p-3 mb-4">
            <div className="flex items-center mb-2">
              <AlertTriangle className="text-yellow-600 mr-2" size={20} />
              <h3 className="font-medium text-yellow-800">Low Stock Alert</h3>
            </div>
            <p className="text-yellow-700 text-sm mb-2">
              {lowStockProducts.length} product(s) are running low on stock:
            </p>
            <div className="flex flex-wrap gap-2">
              {lowStockProducts.map(product => (
                <span key={product.id} className="bg-yellow-200 text-yellow-800 px-2 py-1 text-xs">
                  {product.name} ({product.stock} left)
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-400 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-yellow-200">
              <tr>
                <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-800">
                  Product
                </th>
                <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-800">
                  Barcode
                </th>
                <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-800">
                  Category
                </th>
                <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-800">
                  Price
                </th>
                <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-800">
                  Stock
                </th>
                <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-800">
                  GST
                </th>
                <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-800">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {products.map(product => (
                <tr key={product.id} className={product.stock <= product.minStock ? 'bg-yellow-50' : ''}>
                  <td className="border border-gray-400 px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="text-gray-400 mr-3" size={20} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        {product.stock <= product.minStock && (
                          <div className="text-xs text-yellow-600">Low Stock</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="border border-gray-400 px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {product.barcode}
                  </td>
                  <td className="border border-gray-400 px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {product.category}
                  </td>
                  <td className="border border-gray-400 px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    ₹{product.price}
                  </td>
                  <td className="border border-gray-400 px-3 py-2 whitespace-nowrap">
                    <span className={`text-sm ${
                      product.stock <= 0 ? 'text-red-600' :
                      product.stock <= product.minStock ? 'text-yellow-600' : 'text-gray-900'
                    }`}>
                      {product.stock}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      (Min: {product.minStock})
                    </span>
                  </td>
                  <td className="border border-gray-400 px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {product.gst}%
                  </td>
                  <td className="border border-gray-400 px-3 py-2 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => startEdit(product)}
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-400 p-4 w-80 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-2 py-1 border border-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Barcode</label>
                <input
                  type="text"
                  required
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  className="w-full px-2 py-1 border border-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-2 py-1 border border-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">GST (%)</label>
                  <select
                    required
                    value={formData.gst}
                    onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-400 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select GST</option>
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Min Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 hover:bg-blue-700"
                >
                  {editingProduct ? 'Update' : 'Add'} Product
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}