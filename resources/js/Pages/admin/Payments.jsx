import AdminLayout from '../../Layouts/AdminLayout';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Payments = () => {
    const { payments: initialPayments = [], unpaidOrders = [] } = usePage().props;
    const [payments, setPayments] = useState(initialPayments);
    const [orders, setOrders] = useState(unpaidOrders);
    const [activeTab, setActiveTab] = useState('unpaid'); // 'unpaid' or 'history'
    const [filter, setFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        fetchData();
    }, [dateFilter]);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Fetch unpaid orders
            const ordersResponse = await axios.get('/api/orders/unpaid');
            setOrders(ordersResponse.data);

            // Fetch daily summary
            const summaryResponse = await axios.get(`/api/payments/daily-report?date=${dateFilter}`);
            setSummary(summaryResponse.data.summary);
            setPayments(summaryResponse.data.payments);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePayOrder = (orderId) => {
        window.location.href = `/admin/orders/${orderId}/payment`;
    };

    const getStatusColor = (status) => {
        const colors = {
            'completed': 'bg-green-100 text-green-800',
            'pending': 'bg-yellow-100 text-yellow-800',
            'cancelled': 'bg-red-100 text-red-800',
            'refunded': 'bg-gray-100 text-gray-800',
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Preparing': 'bg-blue-100 text-blue-800',
            'Ready': 'bg-green-100 text-green-800',
            'Served': 'bg-purple-100 text-purple-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Payment Management</h1>
                    <div className="flex space-x-3">
                        <Link
                            href="/admin"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-6 border-b">
                    <button
                        onClick={() => setActiveTab('unpaid')}
                        className={`pb-2 px-4 ${activeTab === 'unpaid'
                            ? 'border-b-2 border-blue-500 text-blue-600 font-semibold'
                            : 'text-gray-600'}`}
                    >
                        Unpaid Orders ({orders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`pb-2 px-4 ${activeTab === 'history'
                            ? 'border-b-2 border-blue-500 text-blue-600 font-semibold'
                            : 'text-gray-600'}`}
                    >
                        Payment History
                    </button>
                </div>

                {/* Summary Cards (only show in history tab) */}
                {activeTab === 'history' && summary && (
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
                            <p className="text-2xl font-bold text-gray-900">${summary.total_sales}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-gray-500">Total Tips</h3>
                            <p className="text-2xl font-bold text-gray-900">${summary.total_tips}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                            <p className="text-2xl font-bold text-green-600">${summary.total_revenue}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-gray-500">Transactions</h3>
                            <p className="text-2xl font-bold text-gray-900">{summary.payment_count}</p>
                        </div>
                    </div>
                )}

                {/* Unpaid Orders Tab */}
                {activeTab === 'unpaid' && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Table</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Server</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center">Loading...</td>
                                    </tr>
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                            No unpaid orders
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">#{order.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {order.table?.number || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {order.user?.username || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {order.order_items?.length || 0} items
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                ${order.total_amount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(order.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => handlePayOrder(order.id)}
                                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                                >
                                                    Process Payment
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Payment History Tab */}
                {activeTab === 'history' && (
                    <>
                        <div className="mb-4 flex space-x-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="border rounded p-2"
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Table</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tip</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {payments.length === 0 ? (
                                        <tr>
                                            <td colSpan="10" className="px-6 py-4 text-center text-gray-500">
                                                No payments found
                                            </td>
                                        </tr>
                                    ) : (
                                        payments.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">#{payment.order_id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {payment.order?.table?.number || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">${payment.amount}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">${payment.tip || 0}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    ${payment.total_paid}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {payment.payment_method}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {payment.paid_at ? new Date(payment.paid_at).toLocaleString() : 'Not paid'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <Link
                                                        href={`/admin/payments/${payment.id}`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        View Receipt
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default Payments;
