import WaiterLayout from "../../Layouts/WaiterLayout";
import { Link } from "@inertiajs/react";

const WaiterDashboard = () => {
    return (
        <WaiterLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Waiter Dashboard</h1>
                <div className="grid grid-cols-3 gap-6">
                
                    {/* Take New Order */}
                    <div className="p-6 bg-white shadow-lg rounded-xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-2" role="img" aria-label="New Order">📝</span>
                                <h2 className="text-xl font-semibold">New Order</h2>
                            </div>
                            <p className="text-gray-600">Create a new order and assign it to a table.</p>
                        </div>
                        <Link href="/waiter/new-order" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-center">
                            Take Order
                        </Link>
                    </div>
                    
                    {/* View Active Orders */}
                    <div className="p-6 bg-white shadow-lg rounded-xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-2" role="img" aria-label="My Orders">📋</span>
                                <h2 className="text-xl font-semibold">My Orders</h2>
                            </div>
                            <p className="text-gray-600">Check pending orders and their status.</p>
                        </div>
                        <Link href="/waiter/orders" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-center">
                            View Orders
                        </Link>
                    </div>
                    
                    {/* Completed Orders */}
                    <div className="p-6 bg-white shadow-lg rounded-xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-2" role="img" aria-label="Order History">✅</span>
                                <h2 className="text-xl font-semibold">Order History</h2>
                            </div>
                            <p className="text-gray-600">View completed orders for reference.</p>
                        </div>
                        <Link href="/waiter/completed-orders" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-center">
                            View History
                        </Link>
                    </div>
                </div>
            </div>
        </WaiterLayout>
    );
};

export default WaiterDashboard;