import { Link } from "@inertiajs/react";
import Dropdown from '@/Components/Dropdown';

const WaiterLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
                <h1 className="text-xl font-bold">Restaurant Management - Waiter</h1>

                {/* Dropdown Menu with All Links */}
                <div className="relative">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded">
                                Waiter Menu ⬇
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                            <Dropdown.Link href="/waiter" className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
                                Dashboard
                            </Dropdown.Link>
                            <Dropdown.Link href="/waiter/orders" className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
                                My Orders
                            </Dropdown.Link>
                            <Dropdown.Link href="/waiter/create-order" className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
                                New Order
                            </Dropdown.Link>
                            <Dropdown.Link href="/waiter/completed-orders" className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
                                Order History
                            </Dropdown.Link>
                            <hr className="my-1" />
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

export default WaiterLayout;
