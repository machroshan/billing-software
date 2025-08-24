import React, { useState } from 'react';
import { BarChart3, TrendingUp, Package, Users, Calendar, Download } from 'lucide-react';
import { Transaction, Product } from '../types';

interface ReportsProps {
  transactions: Transaction[];
  products: Product[];
}

export default function Reports({ transactions, products }: ReportsProps) {
  const [dateRange, setDateRange] = useState('today');

  const filterTransactionsByDate = (transactions: Transaction[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.timestamp);
      switch (dateRange) {
        case 'today':
          return transactionDate >= today;
        case 'yesterday':
          return transactionDate >= yesterday && transactionDate < today;
        case 'week':
          return transactionDate >= weekAgo;
        case 'month':
          return transactionDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  const filteredTransactions = filterTransactionsByDate(transactions);

  const calculateMetrics = () => {
    const totalSales = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
    const totalTransactions = filteredTransactions.length;
    const totalGST = filteredTransactions.reduce((sum, t) => sum + t.gstAmount, 0);
    const totalDiscount = filteredTransactions.reduce((sum, t) => sum + t.discount, 0);
    const averageTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;

    return { totalSales, totalTransactions, totalGST, totalDiscount, averageTransaction };
  };

  const getTopProducts = () => {
    const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};

    filteredTransactions.forEach(transaction => {
      transaction.items.forEach(item => {
        const key = item.product.id;
        if (!productSales[key]) {
          productSales[key] = { name: item.product.name, quantity: 0, revenue: 0 };
        }
        productSales[key].quantity += item.quantity;
        productSales[key].revenue += item.product.price * item.quantity;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const getPaymentMethodBreakdown = () => {
    const breakdown = { cash: 0, card: 0, upi: 0 };
    filteredTransactions.forEach(transaction => {
      breakdown[transaction.paymentMethod] += transaction.total;
    });
    return breakdown;
  };

  const metrics = calculateMetrics();
  const topProducts = getTopProducts();
  const paymentBreakdown = getPaymentMethodBreakdown();

  return (
    <div className="p-4 bg-gray-200 min-h-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Reports & Analytics</h2>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-2 py-1 border border-gray-400 focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
            <button className="bg-green-600 text-white px-3 py-2 hover:bg-green-700 flex items-center text-sm">
              <Download size={16} className="mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-400 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">₹{metrics.totalSales.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-400 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalTransactions}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
              <BarChart3 className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-400 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Sale</p>
              <p className="text-2xl font-bold text-gray-900">₹{metrics.averageTransaction.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 flex items-center justify-center">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-400 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">GST Collected</p>
              <p className="text-2xl font-bold text-gray-900">₹{metrics.totalGST.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 flex items-center justify-center">
              <Calendar className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Products */}
        <div className="bg-white border border-gray-400 p-4">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Package className="mr-2" size={20} />
            Top Selling Products
          </h3>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-300">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">Qty: {product.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{product.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white border border-gray-400 p-4">
          <h3 className="text-lg font-bold mb-4">Payment Method Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(paymentBreakdown).map(([method, amount]) => (
              <div key={method} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 mr-3 ${
                    method === 'cash' ? 'bg-green-500' :
                    method === 'card' ? 'bg-blue-500' : 'bg-purple-500'
                  }`}></div>
                  <span className="capitalize font-medium">{method}</span>
                </div>
                <span className="font-bold">₹{amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white border border-gray-400 p-4">
        <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-yellow-200">
              <tr>
                <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-800">
                  Invoice
                </th>
                <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-800">
                  Date & Time
                </th>
                <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-800">
                  Customer
                </th>
                <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-800">
                  Items
                </th>
                <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-800">
                  Payment
                </th>
                <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-800">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.slice(0, 10).map(transaction => (
                <tr key={transaction.id}>
                  <td className="border border-gray-400 px-3 py-2 text-sm font-medium text-gray-900">
                    {transaction.invoiceNumber}
                  </td>
                  <td className="border border-gray-400 px-3 py-2 text-sm text-gray-600">
                    {new Date(transaction.timestamp).toLocaleString()}
                  </td>
                  <td className="border border-gray-400 px-3 py-2 text-sm text-gray-600">
                    {transaction.customer?.name || 'Walk-in'}
                  </td>
                  <td className="border border-gray-400 px-3 py-2 text-sm text-gray-600">
                    {transaction.items.length} items
                  </td>
                  <td className="border border-gray-400 px-3 py-2 text-sm text-gray-600 capitalize">
                    {transaction.paymentMethod}
                  </td>
                  <td className="border border-gray-400 px-3 py-2 text-sm font-medium text-gray-900">
                    ₹{transaction.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}