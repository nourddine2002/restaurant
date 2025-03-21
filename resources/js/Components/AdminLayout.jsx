import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white p-4">
                <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
                <nav>
                    <ul>
                        <li className="mb-2"><Link to="/admin/dashboard" className="hover:text-gray-400">Dashboard</Link></li>
                        <li className="mb-2"><Link to="/admin/menu" className="hover:text-gray-400">Menu Management</Link></li>
                        <li className="mb-2"><Link to="/admin/orders" className="hover:text-gray-400">Orders Management</Link></li>
                        <li className="mb-2"><Link to="/admin/users" className="hover:text-gray-400">Users Management</Link></li>
                    </ul>
                </nav>
            </aside>
            
            {/* Main Content */}
            <div className="flex-1 bg-gray-100 p-6">
                {/* Navbar */}
                <header className="bg-white shadow p-4 mb-4 flex justify-between">
                    <h1 className="text-lg font-semibold">Admin Dashboard</h1>
                    <button className="text-red-500">Logout</button>
                </header>
                
                {/* Page Content */}
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
