import { useState } from "react";
import WaiterLayout from "../../Layouts/WaiterLayout";

const NewOrder = () => {
    const tables = [
        { id: 1, number: "Table 1" },
        { id: 2, number: "Table 2" },
        { id: 3, number: "Table 3" },
        { id: 4, number: "Table 4" },
    ]; // Later, fetch from backend

    const menuItems = [
        { id: 1, name: "Margherita Pizza", price: 8.99 },
        { id: 2, name: "Cheeseburger", price: 6.99 },
        { id: 3, name: "Caesar Salad", price: 5.49 },
    ];

    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedTable, setSelectedTable] = useState("");

    const handleAddItem = (item) => {
        setSelectedItems([...selectedItems, item]);
    };

    const handleRemoveItem = (index) => {
        setSelectedItems(selectedItems.filter((_, i) => i !== index));
    };

    const handleSubmitOrder = () => {
        if (!selectedTable) {
            alert("Please select a table.");
            return;
        }

        console.log({
            tableId: selectedTable,
            items: selectedItems,
        });

        alert("Order submitted successfully!");
        setSelectedItems([]);
        setSelectedTable("");
    };

    return (
        <WaiterLayout>
            <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-bold mb-4">New Order</h1>

                {/* Select Table Dropdown */}
                <div className="mb-4">
                    <label className="block font-semibold">Select Table:</label>
                    <select
                        value={selectedTable}
                        onChange={(e) => setSelectedTable(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                    >
                        <option value="">Choose a Table</option>
                        {tables.map((table) => (
                            <option key={table.id} value={table.id}>
                                {table.number}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Menu Items */}
                <h2 className="text-xl font-semibold mb-2">Select Items:</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleAddItem(item)}
                            className="p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                        >
                            {item.name} - ${item.price.toFixed(2)}
                        </button>
                    ))}
                </div>

                {/* Selected Items */}
                <h2 className="text-xl font-semibold mb-2">Selected Items:</h2>
                {selectedItems.length === 0 ? (
                    <p className="text-gray-500">No items selected.</p>
                ) : (
                    <ul className="mb-4">
                        {selectedItems.map((item, index) => (
                            <li key={index} className="flex justify-between bg-gray-100 p-2 rounded mb-2">
                                <span>{item.name} - ${item.price.toFixed(2)}</span>
                                <button
                                    onClick={() => handleRemoveItem(index)}
                                    className="text-red-500 hover:underline"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Submit Button */}
                <button
                    onClick={handleSubmitOrder}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                    Submit Order
                </button>
            </div>
        </WaiterLayout>
    );
};

export default NewOrder;
