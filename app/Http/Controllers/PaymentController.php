<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use PDF;

class PaymentController extends Controller
{
    /**
     * Display payments page with unpaid orders
     */
    public function index()
    {
        // Get unpaid orders
        $unpaidOrders = Order::with(['table', 'user', 'orderItems.menuItem'])
            ->whereNotIn('status', ['Paid', 'Canceled'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Get payment history
        $payments = Payment::with(['order.table', 'order.user'])
            ->orderBy('created_at', 'desc')
            ->take(50) // Limit to last 50 payments
            ->get();

        return Inertia::render('admin/Payments', [
            'payments' => $payments,
            'unpaidOrders' => $unpaidOrders
        ]);
    }

    /**
     * Show the form for creating a new payment.
     */
    public function create($orderId)
    {
        $order = Order::with(['table', 'orderItems.menuItem', 'user'])->findOrFail($orderId);

        // Check if order is already paid
        if ($order->status === 'Paid') {
            return redirect()->route('admin.payments')
                ->with('error', 'This order has already been paid.');
        }

        return Inertia::render('admin/CreatePayment', [
            'order' => $order
        ]);
    }

    /**
     * Store a newly created payment with PDF generation
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'payment_method' => 'required|in:cash,credit_card,debit_card,mobile_payment',
            'amount_received' => 'required|numeric|min:0',
            'tip' => 'nullable|numeric|min:0'
        ]);

        DB::beginTransaction();
        try {
            $order = Order::with(['table', 'user', 'orderItems.menuItem'])->findOrFail($validated['order_id']);

            // Check if order is already paid
            if ($order->status === 'Paid') {
                return response()->json([
                    'error' => 'This order has already been paid.'
                ], 400);
            }

            $totalAmount = $order->total_amount;
            $tip = $validated['tip'] ?? 0;
            $totalWithTip = $totalAmount + $tip;

            // Create payment
            $payment = Payment::create([
                'order_id' => $order->id,
                'amount' => $totalAmount,
                'tip' => $tip,
                'total_paid' => $totalWithTip,
                'payment_method' => $validated['payment_method'],
                'amount_received' => $validated['amount_received'],
                'change_given' => max(0, $validated['amount_received'] - $totalWithTip),
                'status' => 'completed',
                'paid_at' => now()
            ]);

            // Update order status
            $order->update(['status' => 'Paid']);

            // Update table status to available
            if ($order->table) {
                $order->table->update(['status' => 'available']);
            }

            // Generate PDF receipt
            $pdf = $this->generateReceiptPDF($payment, $order);

            // Save PDF temporarily
            $filename = 'receipt_' . $payment->id . '_' . time() . '.pdf';
            $path = storage_path('app/public/receipts/' . $filename);

            // Ensure directory exists
            if (!file_exists(storage_path('app/public/receipts'))) {
                mkdir(storage_path('app/public/receipts'), 0777, true);
            }

            $pdf->save($path);

            DB::commit();

            Log::info('Payment processed:', [
                'payment_id' => $payment->id,
                'order_id' => $order->id,
                'amount' => $totalWithTip,
                'method' => $validated['payment_method']
            ]);

            return response()->json([
                'success' => true,
                'payment' => $payment,
                'message' => 'Payment processed successfully',
                'receipt_url' => asset('storage/receipts/' . $filename)
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Payment processing error:', [
                'error' => $e->getMessage(),
                'order_id' => $validated['order_id']
            ]);

            return response()->json([
                'error' => 'Failed to process payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified payment receipt.
     */
    public function show($id)
    {
        $payment = Payment::with(['order.table', 'order.user', 'order.orderItems.menuItem'])
            ->findOrFail($id);

        return Inertia::render('admin/PaymentReceipt', [
            'payment' => $payment
        ]);
    }

    /**
     * Get daily sales report
     */
    public function dailyReport(Request $request)
    {
        $date = $request->get('date', now()->toDateString());

        $payments = Payment::whereDate('paid_at', $date)
            ->where('status', 'completed')
            ->with(['order.user'])
            ->get();

        $summary = [
            'total_sales' => $payments->sum('amount'),
            'total_tips' => $payments->sum('tip'),
            'total_revenue' => $payments->sum('total_paid'),
            'payment_count' => $payments->count(),
            'payment_methods' => $payments->groupBy('payment_method')->map->count(),
            'average_sale' => $payments->avg('amount')
        ];

        return response()->json([
            'date' => $date,
            'payments' => $payments,
            'summary' => $summary
        ]);
    }

    /**
     * Cancel a payment (refund)
     */
    public function cancel($id)
    {
        DB::beginTransaction();
        try {
            $payment = Payment::findOrFail($id);

            // Check if payment can be cancelled
            if ($payment->status === 'cancelled') {
                return response()->json([
                    'error' => 'Payment is already cancelled'
                ], 400);
            }

            // Update payment status
            $payment->update([
                'status' => 'cancelled',
                'cancelled_at' => now()
            ]);

            // Update order status back to Served
            $payment->order->update(['status' => 'Served']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment cancelled successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to cancel payment'
            ], 500);
        }
    }

    /**
     * Export payments data
     */
    public function export(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now());

        $payments = Payment::whereBetween('paid_at', [$startDate, $endDate])
            ->where('status', 'completed')
            ->with(['order.table', 'order.user'])
            ->get();

        // Format data for export
        $exportData = $payments->map(function ($payment) {
            return [
                'Payment ID' => $payment->id,
                'Order ID' => $payment->order_id,
                'Table' => $payment->order->table ? $payment->order->table->number : 'N/A',
                'Waiter' => $payment->order->user->username,
                'Amount' => $payment->amount,
                'Tip' => $payment->tip,
                'Total Paid' => $payment->total_paid,
                'Payment Method' => $payment->payment_method,
                'Date' => $payment->paid_at->format('Y-m-d H:i:s')
            ];
        });

        return response()->json($exportData);
    }

    /**
     * Get unpaid orders via API
     */
    public function getUnpaidOrders()
    {
        $orders = Order::with(['table', 'user', 'orderItems.menuItem'])
            ->whereNotIn('status', ['Paid', 'Canceled'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    /**
     * Generate PDF receipt
     */
    private function generateReceiptPDF($payment, $order)
    {
        $data = [
            'payment' => $payment,
            'order' => $order,
            'restaurant' => [
                'name' => 'Restaurant Name',
                'address' => '123 Restaurant Street',
                'phone' => '(123) 456-7890',
                'email' => 'info@restaurant.com'
            ]
        ];

        $pdf = PDF::loadView('receipts.payment', $data);
        return $pdf;
    }

    /**
     * Download receipt
     */
    public function downloadReceipt($paymentId)
    {
        $payment = Payment::with(['order.table', 'order.user', 'order.orderItems.menuItem'])->findOrFail($paymentId);
        $order = $payment->order;

        $pdf = $this->generateReceiptPDF($payment, $order);

        return $pdf->download('receipt_' . $payment->id . '.pdf');
    }
}
