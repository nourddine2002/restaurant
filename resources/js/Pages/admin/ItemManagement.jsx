import { useState, useEffect } from "react";
import { usePage, Link } from "@inertiajs/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminLayout from "../../Layouts/AdminLayout";

const ItemManagement = () => {
    const { categoryId, categoryName } = usePage().props; // Get props from Laravel
    const [items, setItems] = useState([]);
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [newItemPrice, setNewItemPrice] = useState("");
    const [newItemDescription, setNewItemDescription] = useState("");
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [itemIdToDelete, setItemIdToDelete] = useState(null); // ID of the item to delete
    const [isEditFormVisible, setIsEditFormVisible] = useState(false);
    const [editItemId, setEditItemId] = useState(null);
    const [editItemName, setEditItemName] = useState("");
    const [editItemPrice, setEditItemPrice] = useState("");
    const [editItemDescription, setEditItemDescription] = useState("");

    // Fetch items for the selected category
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`/menu-items/${categoryId}`);
                const data = await response.json();
                setItems(data);
                setError(null);
            } catch (error) {
                console.error("Error fetching items:", error);
                setError("Could not fetch items for this category.");
            }
        };
        if (categoryId) {
            fetchItems();
        }
    }, [categoryId]);

    // Handle adding a new item
    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/menu-items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({
                    name: newItemName,
                    price: parseFloat(newItemPrice),
                    description: newItemDescription,
                    category_id: categoryId,
                }),
            });
            if (response.ok) {
                const newItem = await response.json();
                setItems([...items, newItem.data]);
                setIsAddFormVisible(false);
                setNewItemName("");
                setNewItemPrice("");
                setNewItemDescription("");
            }
        } catch (error) {
            console.error(error);
            setError("An error occurred while adding the item.");
        }
    };

    // Handle deleting an item
    const handleDeleteItem = async () => {
        if (!itemIdToDelete) return;
        try {
            const response = await fetch(`/menu-items/${itemIdToDelete}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
                },
            });
            if (response.ok) {
                setItems(items.filter((item) => item.id !== itemIdToDelete));
                setIsModalOpen(false); // Close the modal after deletion
            }
        } catch (error) {
            console.error(error);
            setError("An error occurred while deleting the item.");
        }
    };
    // Handle editing an item
    const handleEditItem = (itemId) => {
        const itemToEdit = items.find(item => item.id === itemId);
        if (itemToEdit) {
            setEditItemId(itemId);
            setEditItemName(itemToEdit.name);
            setEditItemPrice(itemToEdit.price);
            setEditItemDescription(itemToEdit.description || "");
            setIsEditFormVisible(true);
            setIsAddFormVisible(false); // Hide add form if visible
        }
    };
    // In the handleUpdateItem function, the issue is in how you're processing the updated item
const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`/menu-items/${editItemId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
            },
            body: JSON.stringify({
                name: editItemName,
                price: parseFloat(editItemPrice),
                description: editItemDescription,
                category_id: categoryId,
            }),
        });

        if (response.ok) {
            const updatedItemResponse = await response.json();
            // Fix: Make sure we're correctly accessing the updated item data
            const updatedItem = updatedItemResponse.data || updatedItemResponse;

            // Fix: Update the items array by replacing the old item with the updated one
            setItems(items.map((item) =>
                item.id === editItemId ? updatedItem : item
            ));

            setIsEditFormVisible(false);
            setEditItemId(null);
        }
    } catch (error) {
        console.error(error);
        setError("An error occurred while updating the item.");
    }
};

    return (
        <AdminLayout>
        <div className="p-6">
            {/* Delete Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete this item? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteItem}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Manage Items for Category: {categoryName}</h2>
                <div className="flex space-x-3">
                    <Link
                        href="/admin/menu"
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                    >
                        ← Back to Menu Categories
                    </Link>
                    <button
                        onClick={() => setIsAddFormVisible(!isAddFormVisible)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        {isAddFormVisible ? "Cancel" : "Add New Item"}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                    <p>{error}</p>
                </div>
            )}
            {isEditFormVisible && (
    <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Edit Item</h3>
        <form onSubmit={handleUpdateItem}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                    <input
                        type="text"
                        placeholder="Item Name"
                        value={editItemName}
                        onChange={(e) => setEditItemName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Price</label>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Item Price"
                        value={editItemPrice}
                        onChange={(e) => setEditItemPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Description</label>
                    <textarea
                        placeholder="Item Description"
                        value={editItemDescription}
                        onChange={(e) => setEditItemDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>
            <div className="mt-6 flex space-x-3">
                <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                    Update Item
                </button>
                <button
                    type="button"
                    onClick={() => setIsEditFormVisible(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                >
                    Cancel
                </button>
            </div>
        </form>
    </div>
)}

            {isAddFormVisible && (
                <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Add New Item</h3>
                    <form onSubmit={handleAddItem}>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                <input
                                    type="text"
                                    placeholder="Item Name"
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Item Price"
                                    value={newItemPrice}
                                    onChange={(e) => setNewItemPrice(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Description</label>
                                <textarea
                                    placeholder="Item Description"
                                    value={newItemDescription}
                                    onChange={(e) => setNewItemDescription(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                            >
                                Add Item
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {items.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-500">No items in this category. Create your first item!</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-center text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-center text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-center text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{item.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-700">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{item.price} DH</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        <button
                                            onClick={() => handleEditItem(item.id)}
                                            className="text-blue-600 hover:text-blue-900 font-medium mr-3"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setItemIdToDelete(item.id); // Set the item ID to delete
                                                setIsModalOpen(true); // Open the modal
                                            }}
                                            className="text-red-600 hover:text-red-900 font-medium mr-3"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
        </AdminLayout>
    );
};

export default ItemManagement;
