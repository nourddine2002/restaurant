import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import axios from 'axios';
import AdminLayout from '../../Layouts/AdminLayout';

export default function CreatePayment() {
    const { order } = usePage().props;
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [amountReceived, setAmountReceived] = useState('');
    const [tip, setTip] = useState('0');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const totalAmount = parseFloat(order.total_amount);
    const tipAmount = parseFloat(tip) || 0;
    const totalWithTip = totalAmount + tipAmount;
    const change = parseFloat(amountReceived) - totalWithTip;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (paymentMethod === 'cash' && parseFloat(amountReceived) < totalWithTip) {
            setError('Insufficient amount received');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/payments', {
                order_id: order.id,
                payment_method: paymentMethod,
                amount_received: parseFloat(amountReceived) || totalWithTip,
                tip: tipAmount
            });

            if (response.data.success) {
                // Download the receipt
                const link = document.createElement('a');
                link.href = response.data.receipt_url;
                link.download = `receipt_${response.data.payment.id}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Show success modal
                setSuccess(true);
                setShowSuccessModal(true);

                // Redirect after 3 seconds
                setTimeout(() => {
                    router.visit('/admin/payments');
                }, 3000);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to process payment');
        } finally {
            setLoading(false);
        }
    };

    const quickTipButtons = [
        { label: '10%', value: (totalAmount * 0.10).toFixed(2) },
        { label: '15%', value: (totalAmount * 0.15).toFixed(2) },
        { label: '20%', value: (totalAmount * 0.20).toFixed(2) },
        { label: 'No Tip', value: '0' }
    ];

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Process Payment - Order #{order.id}</h1>

                {/* Success Modal */}
                {showSuccessModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 max-w-md w-full">
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Successful!</h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Payment has been processed successfully and the receipt has been downloaded.
                                </p>
                                <p className="text-sm text-gray-500">
                                    Redirecting to payments page...
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                    {/* Order Summary */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Table:</span>
                                <span className="font-medium">{order.table?.number || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Server:</span>
                                <span className="font-medium">{order.user?.username}</span>
                            </div>
                            <hr className="my-3" />
                            <h3 className="font-semibold mb-2">Items:</h3>
                            {order.order_items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span>{item.quantity}x {item.menu_item.name}</span>
                                    <span>${(item.quantity * item.price).toFixed(2)}</span>
                                </div>
                            ))}
                            <hr className="my-3" />
                            <div className="flex justify-between font-semibold">
                                <span>Subtotal:</span>
                                <span>${totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Payment Method */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Method
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['cash', 'credit_card', 'debit_card', 'mobile_payment'].map((method) => (
                                        <button
                                            key={method}
                                            type="button"
                                            onClick={() => setPaymentMethod(method)}
                                            className={`p-3 border rounded ${
                                                paymentMethod === method
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-300'
                                            }`}
                                        >
                                            {method.replace('_', ' ').toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tip */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tip Amount
                                </label>
                                <div className="flex space-x-2 mb-2">
                                    {quickTipButtons.map((btn) => (
                                        <button
                                            key={btn.label}
                                            type="button"
                                            onClick={() => setTip(btn.value)}
                                            className="px-3 py-1 border rounded text-sm"
                                        >
                                            {btn.label}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={tip}
                                    onChange={(e) => setTip(e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                            </div>

                            {/* Amount Received (for cash) */}
                            {paymentMethod === 'cash' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Amount Received
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={amountReceived}
                                        onChange={(e) => setAmountReceived(e.target.value)}
                                        className="w-full border rounded p-2"
                                        required
                                    />
                                </div>
                            )}

                            {/* Summary */}
                            <div className="bg-gray-50 p-4 rounded">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>${totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tip:</span>
                                        <span>${tipAmount.toFixed(2)}</span>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span>Total:</span>
                                        <span>${totalWithTip.toFixed(2)}</span>
                                    </div>
                                    {paymentMethod === 'cash' && amountReceived && change >= 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Change:</span>
                                            <span>${change.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-100 text-red-700 p-3 rounded">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="bg-green-100 text-green-700 p-3 rounded">
                                    Payment processed successfully! Receipt downloading...
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || success || (paymentMethod === 'cash' && (!amountReceived || change < 0))}
                                className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700 disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : `Process Payment - $${totalWithTip.toFixed(2)}`}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
