import WaiterLayout from "../../Layouts/WaiterLayout";
import { useState } from "react";

const OrderHistory = () => {
    // Sample data - replace with actual data fetching
    const [orders, setOrders] = useState([
        {
            id: 1001,
            table: "Table 5",
            date: "2025-03-15",
            time: "19:45",
            items: ["Grilled Salmon", "Caesar Salad", "Sparkling Water"],
            total: 48.95,
            status: "Completed",
            paymentMethod: "Credit Card"
        },
        {
            id: 1002,
            table: "Table 12",
            date: "2025-03-16",
            time: "18:30",
            items: ["Ribeye Steak", "Mashed Potatoes", "Red Wine", "Tiramisu"],
            total: 87.50,
            status: "Completed",
            paymentMethod: "Cash"
        },
        {
            id: 1003,
            table: "Table 3",
            date: "2025-03-17",
            time: "12:15",
            items: ["Club Sandwich", "French Fries", "Iced Tea"],
            total: 29.99,
            status: "Completed",
            paymentMethod: "Credit Card"
        },
        {
            id: 1004,
            table: "Table 8",
            date: "2025-03-18",
            time: "20:00",
            items: ["Mushroom Risotto", "Garden Salad", "White Wine", "Cheesecake"],
            total: 65.75,
            status: "Completed",
            paymentMethod: "Digital Wallet"
        },
        {
            id: 1005,
            table: "Table 9",
            date: "2025-03-19",
            time: "13:45",
            items: ["Margherita Pizza", "Bruschetta", "Soft Drinks"],
            total: 42.25,
            status: "Completed",
            paymentMethod: "Credit Card"
        }
    ]);

    const [filter, setFilter] = useState("");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });

    // Filter orders based on search input
    const filteredOrders = orders.filter(order =>
        order.table.toLowerCase().includes(filter.toLowerCase()) ||
        order.id.toString().includes(filter) ||
        order.items.some(item => item.toLowerCase().includes(filter.toLowerCase()))
    );

    // Function to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <WaiterLayout>
            <div className="p-6">
                <div className="flex items-center mb-6">
                    <span className="text-2xl mr-2" role="img" aria-label="Order History">📜</span>
                    <h1 className="text-2xl font-bold">Order History</h1>
                </div>

                {/* Filter controls */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[300px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input 
                                type="text" 
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Search by table, order ID or items..." 
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input 
                                type="date" 
                                className="p-2 border border-gray-300 rounded-md"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input 
                                type="date" 
                                className="p-2 border border-gray-300 rounded-md"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                            />
                        </div>
                        <div className="self-end">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Orders table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Table
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Payment
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.table}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.date} at {order.time}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <ul className="list-disc pl-5">
                                                {order.items.map((item, idx) => (
                                                    <li key={idx}>{item}</li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatCurrency(order.total)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.paymentMethod}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                                                View Details
                                            </button>
                                            <button className="text-gray-600 hover:text-gray-900">
                                                Print Receipt
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                Previous
                            </button>
                            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{" "}
                                    <span className="font-medium">{orders.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                        <span className="sr-only">Previous</span>
                                        ◀
                                    </button>
                                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                        1
                                    </button>
                                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                        2
                                    </button>
                                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                        3
                                    </button>
                                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                        <span className="sr-only">Next</span>
                                        ▶
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </WaiterLayout>
    );
};

export default OrderHistory;