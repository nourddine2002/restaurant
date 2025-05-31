import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import SalesChart from './Components/SalesChart';
import {
    FaDownload,
    FaCalendarAlt,
    FaChartLine,
    FaUsers,
    FaCreditCard,
    FaUtensils,
    FaArrowUp,
    FaArrowDown,
    FaFilter,
    FaSync
} from 'react-icons/fa';

const Reports = () => {
    const {
        salesData,
        topSellingItems,
        ordersOverview,
        dailySalesTrend,
        paymentMethodsBreakdown,
        serverPerformance,
        currentPeriod,
        dateRange
    } = usePage().props;

    const [selectedPeriod, setSelectedPeriod] = useState(currentPeriod || 'today');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('overview'); // overview, detailed

    // Calculate percentages for payment methods
    const paymentMethodsWithPercentage = paymentMethodsBreakdown?.map(method => {
        const total = paymentMethodsBreakdown.reduce((sum, m) => sum + m.total_amount, 0);
        return {
            ...method,
            percentage: total > 0 ? ((method.total_amount / total) * 100).toFixed(1) : 0
        };
    }) || [];

    const handlePeriodChange = (period) => {
        setLoading(true);
        setSelectedPeriod(period);
        const url = new URL(window.location.href);
        url.searchParams.set('period', period);

        if (period === 'custom' && customStartDate && customEndDate) {
            url.searchParams.set('start_date', customStartDate);
            url.searchParams.set('end_date', customEndDate);
        }

        window.location.href = url.toString();
    };

    const handleCustomDateSubmit = () => {
        if (customStartDate && customEndDate) {
            handlePeriodChange('custom');
        }
    };

    const handleExport = (format = 'json') => {
        const url = new URL('/admin/reports/export', window.location.origin);
        url.searchParams.set('period', selectedPeriod);
        url.searchParams.set('format', format);

        if (selectedPeriod === 'custom' && customStartDate && customEndDate) {
            url.searchParams.set('start_date', customStartDate);
            url.searchParams.set('end_date', customEndDate);
        }

        window.open(url.toString(), '_blank');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getGrowthColor = (growth) => {
        if (growth > 0) return 'text-green-600';
        if (growth < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    const getGrowthIcon = (growth) => {
        if (growth > 0) return <FaArrowUp className="inline ml-1" />;
        if (growth < 0) return <FaArrowDown className="inline ml-1" />;
        return null;
    };

    const periodLabels = {
        today: 'Today',
        week: 'This Week',
        month: 'This Month',
        year: 'This Year',
        custom: 'Custom Range'
    };

    return (
        <AdminLayout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Sales & Reports</h1>
                        <p className="text-gray-600 mt-1">
                            {periodLabels[selectedPeriod]}
                            {dateRange && (
                                <span className="ml-2 text-sm">
                                    ({new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()})
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setViewMode(viewMode === 'overview' ? 'detailed' : 'overview')}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition flex items-center"
                        >
                            <FaFilter className="mr-2" />
                            {viewMode === 'overview' ? 'Detailed View' : 'Overview'}
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition flex items-center"
                            disabled={loading}
                        >
                            <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
                        </button>
                        <div className="flex">
                            <button
                                onClick={() => handleExport('json')}
                                className="px-4 py-2 bg-green-600 text-white rounded-l-md hover:bg-green-700 transition flex items-center"
                            >
                                <FaDownload className="mr-2" /> JSON
                            </button>
                            <button
                                onClick={() => handleExport('csv')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition flex items-center"
                            >
                                <FaDownload className="mr-2" /> CSV
                            </button>
                        </div>
                        <Link
                            href="/admin"
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                        >
                            ← Dashboard
                        </Link>
                    </div>
                </div>

                {/* Period Selection */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center">
                            <FaCalendarAlt className="text-gray-600 mr-2" />
                            <span className="font-medium">Period:</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {['today', 'week', 'month', 'year'].map(period => (
                                <button
                                    key={period}
                                    onClick={() => handlePeriodChange(period)}
                                    disabled={loading}
                                    className={`px-3 py-2 rounded transition ${
                                        selectedPeriod === period
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {period.charAt(0).toUpperCase() + period.slice(1)}
                                </button>
                            ))}

                            <button
                                onClick={() => setSelectedPeriod('custom')}
                                className={`px-3 py-2 rounded transition ${
                                    selectedPeriod === 'custom'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Custom
                            </button>
                        </div>

                        {selectedPeriod === 'custom' && (
                            <div className="flex flex-wrap items-center gap-2 ml-4 p-3 bg-gray-50 rounded">
                                <input
                                    type="date"
                                    value={customStartDate}
                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                    className="border rounded px-2 py-1 text-sm"
                                />
                                <span className="text-gray-500">to</span>
                                <input
                                    type="date"
                                    value={customEndDate}
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                    className="border rounded px-2 py-1 text-sm"
                                />
                                <button
                                    onClick={handleCustomDateSubmit}
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                    disabled={!customStartDate || !customEndDate}
                                >
                                    Apply
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <FaSync className="animate-spin text-2xl text-blue-600 mr-2" />
                        <span className="text-gray-600">Loading reports...</span>
                    </div>
                )}

                {!loading && (
                    <>
                        {/* Sales Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-md text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100">Total Sales</p>
                                        <p className="text-3xl font-bold">
                                            {formatCurrency(salesData?.total_sales || 0)}
                                        </p>
                                        {salesData?.sales_growth !== undefined && (
                                            <p className="text-blue-100 text-sm">
                                                {salesData.sales_growth > 0 ? '+' : ''}{salesData.sales_growth.toFixed(1)}%
                                                {getGrowthIcon(salesData.sales_growth)}
                                                <span className="ml-1">vs previous period</span>
                                            </p>
                                        )}
                                    </div>
                                    <FaChartLine className="text-4xl text-blue-200" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-md text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100">Total Tips</p>
                                        <p className="text-3xl font-bold">
                                            {formatCurrency(salesData?.total_tips || 0)}
                                        </p>
                                        <p className="text-green-100 text-sm">
                                            {salesData?.total_transactions || 0} transactions
                                        </p>
                                    </div>
                                    <FaCreditCard className="text-4xl text-green-200" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-md text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100">Total Revenue</p>
                                        <p className="text-3xl font-bold">
                                            {formatCurrency(salesData?.total_revenue || 0)}
                                        </p>
                                        <p className="text-purple-100 text-sm">Sales + Tips</p>
                                    </div>
                                    <FaChartLine className="text-4xl text-purple-200" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg shadow-md text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-orange-100">Avg Order Value</p>
                                        <p className="text-3xl font-bold">
                                            {formatCurrency(salesData?.average_order_value || 0)}
                                        </p>
                                        <p className="text-orange-100 text-sm">
                                            {salesData?.total_transactions || 0} orders
                                        </p>
                                    </div>
                                    <FaUtensils className="text-4xl text-orange-200" />
                                </div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Sales Trend Chart */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                                {/* Utilisation d'un simple graphique CSS si SalesChart n'est pas disponible */}
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <FaChartLine className="mr-2 text-purple-600" />
                                    Daily Sales Trend
                                </h3>
                                {dailySalesTrend && dailySalesTrend.length > 0 ? (
                                    <div className="space-y-2">
                                        {dailySalesTrend.slice(0, 7).map((day, index) => {
                                            const maxSales = Math.max(...dailySalesTrend.map(d => d.sales));
                                            const width = maxSales > 0 ? (day.sales / maxSales) * 100 : 0;

                                            return (
                                                <div key={index} className="flex items-center space-x-4">
                                                    <div className="w-20 text-sm text-gray-600">
                                                        {new Date(day.date).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="bg-gray-200 rounded-full h-6 relative">
                                                            <div
                                                                className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                                                                style={{ width: `${width}%` }}
                                                            >
                                                                <span className="text-white text-xs font-medium">
                                                                    {formatCurrency(day.sales)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="w-16 text-sm text-gray-500 text-right">
                                                        {day.orders} orders
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-32 text-gray-500">
                                        No sales data available
                                    </div>
                                )}
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                                        <span className="text-gray-600">Best Day</span>
                                        <span className="font-semibold">
                                            {dailySalesTrend && dailySalesTrend.length > 0 ?
                                                dailySalesTrend.reduce((best, day) =>
                                                    day.sales > best.sales ? day : best
                                                ).day_name : 'N/A'
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                                        <span className="text-gray-600">Best Revenue</span>
                                        <span className="font-semibold">
                                            {dailySalesTrend && dailySalesTrend.length > 0 ?
                                                formatCurrency(Math.max(...dailySalesTrend.map(d => d.sales))) : '$0'
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                                        <span className="text-gray-600">Avg Daily Orders</span>
                                        <span className="font-semibold">
                                            {dailySalesTrend && dailySalesTrend.length > 0 ?
                                                Math.round(dailySalesTrend.reduce((sum, day) => sum + day.orders, 0) / dailySalesTrend.length) : 0
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Data Tables */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Top Selling Items */}
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <FaUtensils className="mr-2 text-orange-600" />
                                    Top Selling Items
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-2">Item</th>
                                                <th className="text-center py-2">Qty</th>
                                                <th className="text-right py-2">Revenue</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topSellingItems?.slice(0, viewMode === 'detailed' ? 15 : 8).map((item, index) => (
                                                <tr key={index} className="border-b hover:bg-gray-50">
                                                    <td className="py-2">
                                                        <div>
                                                            <span className="font-medium">{item.name}</span>
                                                            <div className="text-xs text-gray-500">
                                                                {formatCurrency(item.price)} each
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center py-2 font-semibold">
                                                        {item.total_quantity}
                                                    </td>
                                                    <td className="text-right py-2 font-semibold text-green-600">
                                                        {formatCurrency(item.total_revenue)}
                                                    </td>
                                                </tr>
                                            )) || (
                                                <tr>
                                                    <td colSpan="3" className="text-center py-4 text-gray-500">
                                                        No data available
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Payment Methods & Server Performance */}
                            <div className="space-y-6">
                                {/* Payment Methods */}
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                                        <FaCreditCard className="mr-2 text-green-600" />
                                        Payment Methods
                                    </h3>
                                    <div className="space-y-3">
                                        {paymentMethodsWithPercentage.map((method, index) => (
                                            <div key={index} className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                                    <div>
                                                        <span className="font-medium">{method.method}</span>
                                                        <p className="text-xs text-gray-600">{method.count} transactions</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">{formatCurrency(method.total_amount)}</p>
                                                    <p className="text-xs text-gray-600">{method.percentage}%</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Server Performance */}
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                                        <FaUsers className="mr-2 text-blue-600" />
                                        Top Servers
                                    </h3>
                                    <div className="space-y-3">
                                        {serverPerformance?.slice(0, 5).map((server, index) => (
                                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                                <div>
                                                    <span className="font-medium">{server.username}</span>
                                                    <p className="text-xs text-gray-600">
                                                        {server.total_orders} orders • Avg: {formatCurrency(server.average_order_value)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-green-600">
                                                        {formatCurrency(server.total_sales)}
                                                    </p>
                                                    <div className="w-12 h-1 bg-gray-200 rounded mt-1">
                                                        <div
                                                            className="h-full bg-blue-500 rounded"
                                                            style={{
                                                                width: `${serverPerformance.length > 0 ?
                                                                    (server.total_sales / serverPerformance[0].total_sales) * 100 : 0}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )) || (
                                            <p className="text-gray-500 text-center">No data available</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Orders Overview */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-4">Orders Overview</h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-gray-800">{ordersOverview?.total_orders || 0}</p>
                                    <p className="text-sm text-gray-600">Total Orders</p>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-600">{ordersOverview?.completed_orders || 0}</p>
                                    <p className="text-sm text-gray-600">Completed</p>
                                </div>
                                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                    <p className="text-2xl font-bold text-yellow-600">{ordersOverview?.pending_orders || 0}</p>
                                    <p className="text-sm text-gray-600">Pending</p>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <p className="text-2xl font-bold text-blue-600">{ordersOverview?.served_orders || 0}</p>
                                    <p className="text-sm text-gray-600">Served</p>
                                </div>
                                <div className="text-center p-4 bg-red-50 rounded-lg">
                                    <p className="text-2xl font-bold text-red-600">{ordersOverview?.canceled_orders || 0}</p>
                                    <p className="text-sm text-gray-600">Canceled</p>
                                </div>
                            </div>
                        </div>

                        {/* No Data Message */}
                        {(!salesData || salesData.total_sales === 0) && (
                            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                                <FaChartLine className="mx-auto text-6xl text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Sales Data Available</h3>
                                <p className="text-gray-500 mb-4">
                                    There are no completed orders for the selected period.
                                    Try selecting a different time range or check back after some orders are processed.
                                </p>
                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={() => handlePeriodChange('week')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        View This Week
                                    </button>
                                    <button
                                        onClick={() => handlePeriodChange('month')}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        View This Month
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default Reports;
