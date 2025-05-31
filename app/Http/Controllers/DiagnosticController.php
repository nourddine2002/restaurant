<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Models\OrderItem;
use App\Models\MenuItem;
use App\Models\User;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DiagnosticController extends Controller
{
    public function index()
    {
        // Analyser toutes vos données existantes
        $diagnostic = [
            'database_info' => $this->getDatabaseInfo(),
            'orders_analysis' => $this->getOrdersAnalysis(),
            'payments_analysis' => $this->getPaymentsAnalysis(),
            'items_analysis' => $this->getItemsAnalysis(),
            'recent_data' => $this->getRecentData(),
            'date_ranges' => $this->getDateRanges()
        ];

        return response()->json($diagnostic, 200, [], JSON_PRETTY_PRINT);
    }

    private function getDatabaseInfo()
    {
        return [
            'total_orders' => Order::count(),
            'total_payments' => Payment::count(),
            'total_order_items' => OrderItem::count(),
            'total_menu_items' => MenuItem::count(),
            'total_users' => User::count(),
            'total_tables' => Table::count(),
        ];
    }

    private function getOrdersAnalysis()
    {
        $orders = Order::all();

        return [
            'total_count' => $orders->count(),
            'statuses' => $orders->groupBy('status')->map->count(),
            'date_range' => [
                'oldest' => $orders->min('created_at'),
                'newest' => $orders->max('created_at')
            ],
            'total_amounts' => [
                'min' => $orders->min('total_amount'),
                'max' => $orders->max('total_amount'),
                'avg' => $orders->avg('total_amount'),
                'sum' => $orders->sum('total_amount')
            ],
            'recent_orders' => Order::orderBy('created_at', 'desc')
                ->limit(5)
                ->get(['id', 'status', 'total_amount', 'created_at'])
                ->toArray()
        ];
    }

    private function getPaymentsAnalysis()
    {
        $payments = Payment::all();

        if ($payments->count() === 0) {
            return ['message' => 'No payments found in database'];
        }

        return [
            'total_count' => $payments->count(),
            'statuses' => $payments->groupBy('status')->map->count(),
            'payment_methods' => $payments->groupBy('payment_method')->map->count(),
            'date_range' => [
                'oldest' => $payments->min('paid_at'),
                'newest' => $payments->max('paid_at')
            ],
            'amounts' => [
                'total_amount' => $payments->sum('amount'),
                'total_tips' => $payments->sum('tip'),
                'total_paid' => $payments->sum('total_paid')
            ],
            'recent_payments' => Payment::orderBy('created_at', 'desc')
                ->limit(5)
                ->get(['id', 'order_id', 'amount', 'status', 'paid_at'])
                ->toArray()
        ];
    }

    private function getItemsAnalysis()
    {
        $orderItems = OrderItem::with(['menuItem', 'order'])->get();

        if ($orderItems->count() === 0) {
            return ['message' => 'No order items found'];
        }

        $topItems = OrderItem::select('menu_item_id')
            ->selectRaw('SUM(quantity) as total_quantity')
            ->selectRaw('SUM(quantity * price) as total_revenue')
            ->with('menuItem:id,name')
            ->groupBy('menu_item_id')
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->get();

        return [
            'total_order_items' => $orderItems->count(),
            'total_quantity_sold' => $orderItems->sum('quantity'),
            'total_revenue_from_items' => $orderItems->sum(function($item) {
                return $item->quantity * $item->price;
            }),
            'top_selling_items' => $topItems->map(function($item) {
                return [
                    'name' => $item->menuItem->name ?? 'Unknown',
                    'total_quantity' => $item->total_quantity,
                    'total_revenue' => round($item->total_revenue, 2)
                ];
            })
        ];
    }

    private function getRecentData()
    {
        $today = Carbon::today();
        $thisWeek = Carbon::now()->startOfWeek();
        $thisMonth = Carbon::now()->startOfMonth();

        return [
            'today' => [
                'orders' => Order::whereDate('created_at', $today)->count(),
                'payments' => Payment::whereDate('paid_at', $today)->count(),
                'revenue_orders' => Order::whereDate('created_at', $today)->sum('total_amount'),
                'revenue_payments' => Payment::whereDate('paid_at', $today)->sum('amount')
            ],
            'this_week' => [
                'orders' => Order::where('created_at', '>=', $thisWeek)->count(),
                'payments' => Payment::where('paid_at', '>=', $thisWeek)->count(),
                'revenue_orders' => Order::where('created_at', '>=', $thisWeek)->sum('total_amount'),
                'revenue_payments' => Payment::where('paid_at', '>=', $thisWeek)->sum('amount')
            ],
            'this_month' => [
                'orders' => Order::where('created_at', '>=', $thisMonth)->count(),
                'payments' => Payment::where('paid_at', '>=', $thisMonth)->count(),
                'revenue_orders' => Order::where('created_at', '>=', $thisMonth)->sum('total_amount'),
                'revenue_payments' => Payment::where('paid_at', '>=', $thisMonth)->sum('amount')
            ]
        ];
    }

    private function getDateRanges()
    {
        return [
            'orders_date_samples' => Order::select('id', 'created_at', 'status', 'total_amount')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get(),
            'payments_date_samples' => Payment::select('id', 'paid_at', 'status', 'amount')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
        ];
    }
}
