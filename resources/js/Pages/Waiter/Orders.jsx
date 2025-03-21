import { useState } from "react";
import WaiterLayout from "../../Layouts/WaiterLayout";

const ActiveOrders = () => {
    // Sample data (Later, fetch from backend)
    const [orders, setOrders] = useState([
        { id: 1, table: "Table 2", status: "Pending", items: ["Pizza", "Cola"] },
        { id: 2, table: "Table 5", status: "In Progress", items: ["Burger", "Fries"] },
        { id: 3, table: "Table 1", status: "Pending", items: ["Pasta", "Salad"] },
    ]);

    const handleMarkComplete = (orderId) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: "Completed" } : order
        ));
    };

    return (
        <WaiterLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">My Orders</h1>
                
                {orders.length === 0 ? (
                    <p className="text-gray-500">No active orders.</p>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="p-4 bg-white shadow-md rounded-lg">
                                <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                                <p><strong>Table:</strong> {order.table}</p>
                                <p><strong>Status:</strong> <span className={
                                    order.status === "Pending" ? "text-red-500" :
                                    order.status === "In Progress" ? "text-yellow-500" :
                                    "text-green-500"
                                }>{order.status}</span></p>
                                <p><strong>Items:</strong> {order.items.join(", ")}</p>
                                
                                {order.status !== "Completed" && (
                                    <button
                                        onClick={() => handleMarkComplete(order.id)}
                                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                    >
                                        Mark as Completed
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </WaiterLayout>
    );
};

export default ActiveOrders;
