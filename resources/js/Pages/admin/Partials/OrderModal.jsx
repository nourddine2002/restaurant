    import React, { useState, useEffect } from "react";
    import Modal from "@/Components/Modal"; // Make sure this exists or use your modal
    import { XMarkIcon } from "@heroicons/react/24/outline";

    const OrderModal = ({ show, onClose, order, onSave }) => {
    const [editedOrder, setEditedOrder] = useState(order || {});

    useEffect(() => {
        setEditedOrder(order || {});
    }, [order]);

    if (!order) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedOrder(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(editedOrder);
    };

    return (
        <Modal show={show} onClose={onClose}>
        <div className="bg-white p-6 rounded shadow-md max-w-xl w-full">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Order #{order.id} Details</h2>
            <button onClick={onClose}>
                <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
            </div>
            <div>
            <p><strong>Table:</strong> {order.table?.number}</p>
            <p><strong>Staff:</strong> {order.user?.username}</p>
            <p><strong>Total:</strong> ${order.total_amount}</p>

            <p className="mt-2"><strong>Items:</strong></p>
            <ul className="list-disc list-inside">
                {order.order_items?.map(item => (
                <li key={item.id}>
                    {item.quantity} x {item.menu_item?.name}
                </li>
                ))}
            </ul>

            <div className="mt-4">
                <label className="block font-semibold">Update Status</label>
                <select
                name="status"
                value={editedOrder.status}
                onChange={handleChange}
                className="border p-2 mt-1 rounded w-full"
                >
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="served">Served</option>
                <option value="paid">Paid</option>
                <option value="canceled">Canceled</option>
                </select>
            </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
            <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">
                Cancel
            </button>
            <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
                Save
            </button>
            </div>
        </div>
        </Modal>
    );
    };

    export default OrderModal;
