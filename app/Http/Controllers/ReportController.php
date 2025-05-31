<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Models\OrderItem;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->get('period', 'today');
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');

        // Set date range based on period
        $dates = $this->getDateRange($period, $startDate, $endDate);

        // Debug: Log what we're looking for
        \Log::info('Report Debug - Date Range:', [
            'start' => $dates['start']->toDateTimeString(),
            'end' => $dates['end']->toDateTimeString(),
            'period' => $period
        ]);

        // Get sales data with multiple approaches
        $salesData = $this->getSalesData($dates['start'], $dates['end']);

        // Get top selling items
        $topSellingItems = $this->getTopSellingItems($dates['start'], $dates['end']);

        // Get orders overview
        $ordersOverview = $this->getOrdersOverview($dates['start'], $dates['end']);

        // Get daily sales trend
        $dailySalesTrend = $this->getDailySalesTrend($dates['start'], $dates['end']);

        // Get payment methods breakdown
        $paymentMethodsBreakdown = $this->getPaymentMethodsBreakdown($dates['start'], $dates['end']);

        // Get server performance
        $serverPerformance = $this->getServerPerformance($dates['start'], $dates['end']);

        // Debug: Log what data we found
        \Log::info('Report Debug - Found Data:', [
            'sales_total' => $salesData['total_sales'] ?? 0,
            'orders_count' => $ordersOverview['total_orders'] ?? 0,
            'top_items_count' => count($topSellingItems),
            'daily_trend_count' => count($dailySalesTrend)
        ]);

        return Inertia::render('admin/Reports', [
            'salesData' => $salesData,
            'topSellingItems' => $topSellingItems,
            'ordersOverview' => $ordersOverview,
            'dailySalesTrend' => $dailySalesTrend,
            'paymentMethodsBreakdown' => $paymentMethodsBreakdown,
            'serverPerformance' => $serverPerformance,
            'currentPeriod' => $period,
            'dateRange' => [
                'start' => $dates['start']->toDateString(),
                'end' => $dates['end']->toDateString()
            ]
        ]);
    }

    private function getDateRange($period, $startDate = null, $endDate = null)
    {
        $now = Carbon::now();

        switch ($period) {
            case 'today':
                return [
                    'start' => $now->copy()->startOfDay(),
                    'end' => $now->copy()->endOfDay()
                ];
            case 'week':
                return [
                    'start' => $now->copy()->startOfWeek(),
                    'end' => $now->copy()->endOfWeek()
                ];
            case 'month':
                return [
                    'start' => $now->copy()->startOfMonth(),
                    'end' => $now->copy()->endOfMonth()
                ];
            case 'year':
                return [
                    'start' => $now->copy()->startOfYear(),
                    'end' => $now->copy()->endOfYear()
                ];
            case 'custom':
                return [
                    'start' => $startDate ? Carbon::parse($startDate)->startOfDay() : $now->copy()->startOfMonth(),
                    'end' => $endDate ? Carbon::parse($endDate)->endOfDay() : $now->copy()->endOfDay()
                ];
            default:
                return [
                    'start' => $now->copy()->startOfDay(),
                    'end' => $now->copy()->endOfDay()
                ];
        }
    }

    private function getSalesData($startDate, $endDate)
    {
        // Méthode 1: Essayer avec les paiements s'ils existent
        $paymentsExist = Payment::exists();

        if ($paymentsExist) {
            $payments = Payment::where('status', 'completed')
                ->whereBetween('paid_at', [$startDate, $endDate])
                ->get();

            if ($payments->count() > 0) {
                $totalSales = $payments->sum('amount');
                $totalTips = $payments->sum('tip');
                $totalRevenue = $payments->sum('total_paid');
                $totalTransactions = $payments->count();

                // Debug
                \Log::info('Found payments data:', [
                    'count' => $totalTransactions,
                    'total_sales' => $totalSales
                ]);

                return [
                    'total_sales' => round($totalSales, 2),
                    'total_tips' => round($totalTips, 2),
                    'total_revenue' => round($totalRevenue, 2),
                    'total_transactions' => $totalTransactions,
                    'average_order_value' => $totalTransactions > 0 ? round($totalSales / $totalTransactions, 2) : 0,
                    'sales_growth' => 0 // Pour l'instant
                ];
            }
        }

        // Méthode 2: Utiliser directement les commandes payées
        $paidOrders = Order::where('status', 'Paid')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        \Log::info('Found paid orders:', [
            'count' => $paidOrders->count(),
            'date_range' => [$startDate->toDateString(), $endDate->toDateString()]
        ]);

        if ($paidOrders->count() > 0) {
            $totalSales = $paidOrders->sum('total_amount');
            $totalTransactions = $paidOrders->count();

            return [
                'total_sales' => round($totalSales, 2),
                'total_tips' => 0, // Pas de données de pourboires dans les commandes
                'total_revenue' => round($totalSales, 2),
                'total_transactions' => $totalTransactions,
                'average_order_value' => $totalTransactions > 0 ? round($totalSales / $totalTransactions, 2) : 0,
                'sales_growth' => 0
            ];
        }

        // Méthode 3: Toutes les commandes peu importe le statut
        $allOrders = Order::whereBetween('created_at', [$startDate, $endDate])
            ->whereNotNull('total_amount')
            ->get();

        \Log::info('Found all orders:', [
            'count' => $allOrders->count(),
            'statuses' => $allOrders->pluck('status')->unique()
        ]);

        if ($allOrders->count() > 0) {
            $totalSales = $allOrders->sum('total_amount');
            $totalTransactions = $allOrders->count();

            return [
                'total_sales' => round($totalSales, 2),
                'total_tips' => 0,
                'total_revenue' => round($totalSales, 2),
                'total_transactions' => $totalTransactions,
                'average_order_value' => $totalTransactions > 0 ? round($totalSales / $totalTransactions, 2) : 0,
                'sales_growth' => 0
            ];
        }

        // Aucune donnée trouvée
        return [
            'total_sales' => 0,
            'total_tips' => 0,
            'total_revenue' => 0,
            'total_transactions' => 0,
            'average_order_value' => 0,
            'sales_growth' => 0
        ];
    }

    private function getTopSellingItems($startDate, $endDate, $limit = 10)
    {
        // Méthode basée sur les items de commande avec des commandes payées
        $topItems = OrderItem::select(
                'menu_items.name',
                'menu_items.price',
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.quantity * order_items.price) as total_revenue')
            )
            ->join('menu_items', 'order_items.menu_item_id', '=', 'menu_items.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'Paid') // Seulement les commandes payées
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->groupBy('menu_items.id', 'menu_items.name', 'menu_items.price')
            ->orderByDesc('total_quantity')
            ->limit($limit)
            ->get();

        // Si aucun résultat avec "Paid", essayer avec toutes les commandes
        if ($topItems->count() === 0) {
            $topItems = OrderItem::select(
                    'menu_items.name',
                    'menu_items.price',
                    DB::raw('SUM(order_items.quantity) as total_quantity'),
                    DB::raw('SUM(order_items.quantity * order_items.price) as total_revenue')
                )
                ->join('menu_items', 'order_items.menu_item_id', '=', 'menu_items.id')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->whereBetween('orders.created_at', [$startDate, $endDate])
                ->groupBy('menu_items.id', 'menu_items.name', 'menu_items.price')
                ->orderByDesc('total_quantity')
                ->limit($limit)
                ->get();
        }

        return $topItems->map(function ($item) {
            return [
                'name' => $item->name,
                'price' => $item->price,
                'total_quantity' => $item->total_quantity,
                'total_revenue' => round($item->total_revenue, 2)
            ];
        });
    }

    private function getOrdersOverview($startDate, $endDate)
    {
        $orders = Order::whereBetween('created_at', [$startDate, $endDate])->get();

        $statusCounts = $orders->groupBy('status')->map->count();

        return [
            'total_orders' => $orders->count(),
            'completed_orders' => $statusCounts->get('Paid', 0),
            'pending_orders' => $statusCounts->get('Pending', 0) + $statusCounts->get('Preparing', 0) + $statusCounts->get('Ready', 0),
            'served_orders' => $statusCounts->get('Served', 0),
            'canceled_orders' => $statusCounts->get('Canceled', 0),
            'status_breakdown' => $statusCounts->toArray()
        ];
    }

    private function getDailySalesTrend($startDate, $endDate)
    {
        $days = [];
        $current = $startDate->copy();

        while ($current <= $endDate) {
            $dayStart = $current->copy()->startOfDay();
            $dayEnd = $current->copy()->endOfDay();

            // Essayer d'abord avec les paiements
            $dailySales = 0;
            $dailyOrders = 0;

            if (Payment::exists()) {
                $dailySales = Payment::where('status', 'completed')
                    ->whereBetween('paid_at', [$dayStart, $dayEnd])
                    ->sum('amount');

                $dailyOrders = Payment::where('status', 'completed')
                    ->whereBetween('paid_at', [$dayStart, $dayEnd])
                    ->count();
            }

            // Si pas de paiements, utiliser les commandes
            if ($dailySales == 0) {
                $dailySales = Order::where('status', 'Paid')
                    ->whereBetween('created_at', [$dayStart, $dayEnd])
                    ->sum('total_amount');

                $dailyOrders = Order::where('status', 'Paid')
                    ->whereBetween('created_at', [$dayStart, $dayEnd])
                    ->count();
            }

            // Si toujours rien, utiliser toutes les commandes
            if ($dailySales == 0) {
                $dailySales = Order::whereBetween('created_at', [$dayStart, $dayEnd])
                    ->whereNotNull('total_amount')
                    ->sum('total_amount');

                $dailyOrders = Order::whereBetween('created_at', [$dayStart, $dayEnd])
                    ->whereNotNull('total_amount')
                    ->count();
            }

            $days[] = [
                'date' => $current->format('Y-m-d'),
                'day_name' => $current->format('l'),
                'sales' => round($dailySales, 2),
                'orders' => $dailyOrders
            ];

            $current->addDay();
        }

        return $days;
    }

    private function getPaymentMethodsBreakdown($startDate, $endDate)
    {
        // Si les paiements existent, les utiliser
        if (Payment::exists()) {
            return Payment::select(
                    'payment_method',
                    DB::raw('COUNT(*) as count'),
                    DB::raw('SUM(amount) as total_amount'),
                    DB::raw('SUM(total_paid) as total_paid')
                )
                ->where('status', 'completed')
                ->whereBetween('paid_at', [$startDate, $endDate])
                ->groupBy('payment_method')
                ->get()
                ->map(function ($payment) {
                    return [
                        'method' => ucwords(str_replace('_', ' ', $payment->payment_method)),
                        'count' => $payment->count,
                        'total_amount' => round($payment->total_amount, 2),
                        'total_paid' => round($payment->total_paid, 2),
                        'percentage' => 0
                    ];
                });
        }

        // Sinon, créer des données par défaut basées sur les commandes
        $totalOrders = Order::where('status', 'Paid')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        if ($totalOrders > 0) {
            return collect([
                [
                    'method' => 'Cash',
                    'count' => $totalOrders,
                    'total_amount' => Order::where('status', 'Paid')
                        ->whereBetween('created_at', [$startDate, $endDate])
                        ->sum('total_amount'),
                    'total_paid' => Order::where('status', 'Paid')
                        ->whereBetween('created_at', [$startDate, $endDate])
                        ->sum('total_amount'),
                    'percentage' => 100
                ]
            ]);
        }

        return collect([]);
    }

    private function getServerPerformance($startDate, $endDate)
    {
        // Essayer d'abord avec les paiements
        if (Payment::exists()) {
            return Order::select(
                    'users.username',
                    DB::raw('COUNT(orders.id) as total_orders'),
                    DB::raw('SUM(payments.amount) as total_sales'),
                    DB::raw('AVG(payments.amount) as average_order_value')
                )
                ->join('users', 'orders.user_id', '=', 'users.id')
                ->join('payments', 'orders.id', '=', 'payments.order_id')
                ->where('payments.status', 'completed')
                ->whereBetween('payments.paid_at', [$startDate, $endDate])
                ->groupBy('users.id', 'users.username')
                ->orderByDesc('total_sales')
                ->get()
                ->map(function ($server) {
                    return [
                        'username' => $server->username,
                        'total_orders' => $server->total_orders,
                        'total_sales' => round($server->total_sales, 2),
                        'average_order_value' => round($server->average_order_value, 2)
                    ];
                });
        }

        // Sinon utiliser directement les commandes
        return Order::select(
                'users.username',
                DB::raw('COUNT(orders.id) as total_orders'),
                DB::raw('SUM(orders.total_amount) as total_sales'),
                DB::raw('AVG(orders.total_amount) as average_order_value')
            )
            ->join('users', 'orders.user_id', '=', 'users.id')
            ->where('orders.status', 'Paid')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->groupBy('users.id', 'users.username')
            ->orderByDesc('total_sales')
            ->get()
            ->map(function ($server) {
                return [
                    'username' => $server->username,
                    'total_orders' => $server->total_orders,
                    'total_sales' => round($server->total_sales, 2),
                    'average_order_value' => round($server->average_order_value, 2)
                ];
            });
    }

    public function export(Request $request)
    {
        $period = $request->get('period', 'today');
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');
        $format = $request->get('format', 'json');

        $dates = $this->getDateRange($period, $startDate, $endDate);

        $exportData = [
            'period' => $period,
            'date_range' => [
                'start' => $dates['start']->format('Y-m-d'),
                'end' => $dates['end']->format('Y-m-d')
            ],
            'sales_data' => $this->getSalesData($dates['start'], $dates['end']),
            'top_selling_items' => $this->getTopSellingItems($dates['start'], $dates['end']),
            'orders_overview' => $this->getOrdersOverview($dates['start'], $dates['end']),
            'daily_sales_trend' => $this->getDailySalesTrend($dates['start'], $dates['end']),
            'payment_methods_breakdown' => $this->getPaymentMethodsBreakdown($dates['start'], $dates['end']),
            'server_performance' => $this->getServerPerformance($dates['start'], $dates['end'])
        ];

        if ($format === 'csv') {
            return $this->exportToCsv($exportData);
        }

        return response()->json($exportData);
    }

    private function exportToCsv($data)
    {
        $filename = 'sales_report_' . $data['date_range']['start'] . '_to_' . $data['date_range']['end'] . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function() use ($data) {
            $file = fopen('php://output', 'w');

            // Sales Summary
            fputcsv($file, ['SALES SUMMARY']);
            fputcsv($file, ['Metric', 'Value']);
            fputcsv($file, ['Total Sales', '$' . $data['sales_data']['total_sales']]);
            fputcsv($file, ['Total Tips', '$' . $data['sales_data']['total_tips']]);
            fputcsv($file, ['Total Revenue', '$' . $data['sales_data']['total_revenue']]);
            fputcsv($file, ['Total Transactions', $data['sales_data']['total_transactions']]);
            fputcsv($file, ['Average Order Value', '$' . $data['sales_data']['average_order_value']]);
            fputcsv($file, []);

            // Top Selling Items
            fputcsv($file, ['TOP SELLING ITEMS']);
            fputcsv($file, ['Item Name', 'Quantity Sold', 'Revenue']);
            foreach ($data['top_selling_items'] as $item) {
                fputcsv($file, [$item['name'], $item['total_quantity'], '$' . $item['total_revenue']]);
            }
            fputcsv($file, []);

            // Daily Sales Trend
            fputcsv($file, ['DAILY SALES TREND']);
            fputcsv($file, ['Date', 'Sales', 'Orders']);
            foreach ($data['daily_sales_trend'] as $day) {
                fputcsv($file, [$day['date'], '$' . $day['sales'], $day['orders']]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
