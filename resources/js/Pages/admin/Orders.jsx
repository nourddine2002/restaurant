import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {usePage,Link} from '@inertiajs/react';
import AdminLayout from "../../Layouts/AdminLayout";

const Orders = () => {
const { props } = usePage();
const initialOrders = props.orders || [];
const [orders, setOrders] = useState(initialOrders);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [statusFilter, setStatusFilter] = useState('all');
  
  // Status colors for visual indication
  const statusColors = {
    'pending': 'bg-yellow-200',
    'preparing': 'bg-blue-200',
    'ready': 'bg-green-200',
    'served': 'bg-purple-200',
    'paid': 'bg-gray-200',
    'canceled': 'bg-red-200'
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/orders');
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
      await axios.delete(`/api/orders/${orderId}`);
      fetchOrders(); // Refresh orders after deletion
    } catch (err) {
      setError('Failed to delete order. Please try again.');
      console.error(err);
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  if (loading) return <div className="text-center py-10">Loading orders...</div>;

  return (
    <AdminLayout>
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Orders</h1>
        <Link 
          href="/admin/orders/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create New Order
        </Link>
      <Link href="/admin" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      ← Back to Dashboard
      </Link>
      </div>


      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="mr-2">Filter by Status:</label>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="served">Served</option>
          <option value="paid">Paid</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-10 bg-gray-100 rounded">
          No orders found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Order ID</th>
                <th className="py-2 px-4 border">Table</th>
                <th className="py-2 px-4 border">Staff</th>
                <th className="py-2 px-4 border">Items</th>
                <th className="py-2 px-4 border">Total</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Created At</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td className="py-2 px-4 border">{order.id}</td>
                  <td className="py-2 px-4 border">{order.table.number}</td>
                  <td className="py-2 px-4 border">{order.user.username}</td>
                  <td className="py-2 px-4 border">
                    <ul className="list-disc list-inside">
                      {order.order_items .map(item => (
                        <li key={item.id}>
                          {item.quantity} x {item.menu_item.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-2 px-4 border">${order.total_amount}</td>
                  <td className="py-2 px-4 border">
                    <span className={`px-2 py-1 rounded ${statusColors[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-2 px-4 border">
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border">
                    <div className="flex space-x-2">
                      <Link 
                        href={`/admin/orders/${order.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
                      >
                        View
                      </Link>
                      <Link 
                        href={`/admin/orders/${order.id}/edit`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => deleteOrder(order.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default Orders;