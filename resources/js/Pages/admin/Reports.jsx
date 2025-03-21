import AdminLayout from '../../Layouts/AdminLayout';

const Reports = () => {
    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Sales & Reports</h1>
                
                <div className="grid grid-cols-2 gap-6">
                    {/* Sales Summary */}
                    <div className="p-4 bg-white shadow-md rounded-lg">
                        <h2 className="text-lg font-semibold mb-2">Total Sales</h2>
                        <p className="text-3xl font-bold text-green-500">$12,500</p>
                        <p className="text-gray-500">This Month</p>
                    </div>

                    {/* Best-Selling Items */}
                    <div className="p-4 bg-white shadow-md rounded-lg">
                        <h2 className="text-lg font-semibold mb-2">Best-Selling Items</h2>
                        <ul className="list-disc pl-5 text-gray-700">
                            <li>🍔 Cheeseburger - 120 Orders</li>
                            <li>🍕 Margherita Pizza - 95 Orders</li>
                            <li>🥗 Caesar Salad - 75 Orders</li>
                        </ul>
                    </div>

                    {/* Orders Overview */}
                    <div className="p-4 bg-white shadow-md rounded-lg col-span-2">
                        <h2 className="text-lg font-semibold mb-2">Orders Overview</h2>
                        <p className="text-gray-700">Total Orders: <span className="font-bold">350</span></p>
                        <p className="text-gray-700">Completed Orders: <span className="font-bold text-green-500">320</span></p>
                        <p className="text-gray-700">Pending Orders: <span className="font-bold text-yellow-500">20</span></p>
                        <p className="text-gray-700">Canceled Orders: <span className="font-bold text-red-500">10</span></p>
                    </div>
                </div>

                {/* Back to Dashboard Button */}
                <div className="mt-6">
                    <a href="/admin" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                        ← Back to Dashboard
                    </a>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Reports;
