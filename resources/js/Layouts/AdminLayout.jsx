import Dropdown from '@/Components/Dropdown';

const AdminLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
                <h1 className="text-xl font-bold">Restaurant Management - Admin</h1>

                {/* Dropdown Menu for Logout */}
                <div className="relative">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded">
                                Admin Menu ⬇
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md">
                            <Dropdown.Link 
                                href="/admin"
                                className="block w-full text-left px-4 py-2 text-black-600 hover:bg-gray-100"
                            >
                                Dashboard
                            </Dropdown.Link>
                            <Dropdown.Link 
                                href="/admin/orders/create"
                                className="block w-full text-left px-4 py-2 text-black-600 hover:bg-gray-100"
                            >
                                Create Order
                            </Dropdown.Link>
                            <Dropdown.Link 
                                href="/admin/my-orders"
                                className="block w-full text-left px-4 py-2 text-black-600 hover:bg-gray-100"
                            >
                                My Orders
                            </Dropdown.Link>
                            <Dropdown.Link 
                                href="/admin/orders"
                                className="block w-full text-left px-4 py-2 text-black-600 hover:bg-gray-100"
                            >
                                Manage Orders
                            </Dropdown.Link>
                            <Dropdown.Link 
                                href="/admin/users"
                                className="block w-full text-left px-4 py-2 text-black-600 hover:bg-gray-100"
                            >
                                Manage Users
                            </Dropdown.Link>
                            <Dropdown.Link 
                                href="/admin/menu"
                                className="block w-full text-left px-4 py-2 text-black-600 hover:bg-gray-100"
                            >
                                Manage Menu
                            </Dropdown.Link>
                            <Dropdown.Link 
                                href="/admin/reports"
                                className="block w-full text-left px-4 py-2 text-black-600 hover:bg-gray-100"
                            >
                                Manage Reports
                            </Dropdown.Link>
                            <Dropdown.Link 
                                href="/admin/tables"
                                className="block w-full text-left px-4 py-2 text-black-600 hover:bg-gray-100"
                            >
                                Manage Tables
                            </Dropdown.Link>
                            <Dropdown.Link 
                                href="/admin/payments"
                                className="block w-full text-left px-4 py-2 text-black-600 hover:bg-gray-100"
                            >
                                Manage Payments
                            </Dropdown.Link>
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
            </nav>

            {/* Main Content */}
            <main className="p-6 container mx-auto">{children}</main>
        </div>
    );
};

export default AdminLayout;
