import { Link } from "@inertiajs/react";
import Dropdown from '@/Components/Dropdown';

const WaiterLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-blue-600 text-white p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">Waiter Panel</h2>
                <nav>
                    <ul className="space-y-4">
                        <li><Link href="/waiter" className="block px-4 py-2 hover:bg-blue-700 rounded">Dashboard</Link></li>
                        <li><Link href="/waiter/orders" className="block px-4 py-2 hover:bg-blue-700 rounded">My Orders</Link></li>
                        <li><Link href="/waiter/new-order" className="block px-4 py-2 hover:bg-blue-700 rounded">New Order</Link></li>
                        <li><Link href="/waiter/completed-orders" className="block px-4 py-2 hover:bg-blue-700 rounded">Order History</Link></li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Navbar */}
                <header className="bg-white shadow p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Waiter Dashboard</h1>
                    <div className="relative">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded">
                                                    Waiter Menu ⬇
                                                </button>
                                            </Dropdown.Trigger>
                                            <Dropdown.Content className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md">
                                                <Dropdown.Link 
                                                    href={route('logout')} 
                                                    method="post" 
                                                    as="button"
                                                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                                                >
                                                    Log Out
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default WaiterLayout;
