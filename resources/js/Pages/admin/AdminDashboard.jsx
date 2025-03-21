import AdminLayout from '../../Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
const AdminDashboard = () => {
    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                <div className="grid grid-cols-3 gap-6">
                    {/* Manage Orders */}
                    <div className="p-4 bg-white shadow-md rounded-lg">
                        <div className="flex items-center mb-2">
                            <span className="text-2xl mr-2" role="img" aria-label="Orders">📋</span>
                            <h2 className="text-xl font-semibold">Orders</h2>
                        </div>
                        <p>View and manage restaurant orders.</p>
                        <Link href="/admin/orders" className="text-blue-500 hover:underline">Manage Orders</Link>
                    </div>
                    
                    {/* Manage Users */}
                    <div className="p-4 bg-white shadow-md rounded-lg">
                        <div className="flex items-center mb-2">
                            <span className="text-2xl mr-2" role="img" aria-label="Users">👥</span>
                            <h2 className="text-xl font-semibold">Users</h2>
                        </div>
                        <p>View and manage staff and waiters.</p>
                        <Link href="/admin/users" className="text-blue-500 hover:underline">Manage Users</Link>
                    </div>
                    
                    {/* Manage Menu Items */}
                    <div className="p-4 bg-white shadow-md rounded-lg">
                        <div className="flex items-center mb-2">
                            <span className="text-2xl mr-2" role="img" aria-label="Menu">🍽️</span>
                            <h2 className="text-xl font-semibold">Menu Items</h2>
                        </div>
                        <p>Edit and update the restaurant menu.</p>
                        <Link href="/admin/menu" className="text-blue-500 hover:underline">Manage Menu</Link>
                    </div>
                    
                    {/* Sales & Reports */}
                    <div className="p-4 bg-white shadow-md rounded-lg">
                        <div className="flex items-center mb-2">
                            <span className="text-2xl mr-2" role="img" aria-label="Reports">📊</span>
                            <h2 className="text-xl font-semibold">Sales & Reports</h2>
                        </div>
                        <p>View daily, weekly, and monthly sales reports.</p>
                        <Link href="/admin/reports" className="text-blue-500 hover:underline">View Reports</Link>
                    </div>
                    
                    {/* Manage Tables */}
                    <div className="p-4 bg-white shadow-md rounded-lg">
                        <div className="flex items-center mb-2">
                            <span className="text-2xl mr-2" role="img" aria-label="Tables">🪑</span>
                            <h2 className="text-xl font-semibold">Tables</h2>
                        </div>
                        <p>Manage restaurant seating and reservations.</p>
                        <Link href="/admin/tables" className="text-blue-500 hover:underline">Manage Tables</Link>
                    </div>
                    
                    {/* Manage Payments */}
                    <div className="p-4 bg-white shadow-md rounded-lg">
                        <div className="flex items-center mb-2">
                            <span className="text-2xl mr-2" role="img" aria-label="Payments">💳</span>
                            <h2 className="text-xl font-semibold">Payments</h2>
                        </div>
                        <p>View and manage payment transactions.</p>
                        <Link href="/admin/payments" className="text-blue-500 hover:underline">Manage Payments</Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;