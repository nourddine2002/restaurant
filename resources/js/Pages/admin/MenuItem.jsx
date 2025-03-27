import React from 'react';
import { usePage } from '@inertiajs/react'
import AdminLayout from '../../Layouts/AdminLayout';
import { Inertia } from '@inertiajs/inertia';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';

export default function MenuItems() {
    // Use usePage to access props passed from the backend
    const { categoryId, categoryName } = usePage().props;
    const [menuItems, setMenuItems] = React.useState([]);
    const [newItem, setNewItem] = React.useState({
        name: '',
        price: '',
        description: ''
    });

    // Fetch menu items when component mounts
    React.useEffect(() => {
        fetch(`/api/menu/${categoryId}`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch menu items');
                return response.json();
            })
            .then(data => setMenuItems(data))
            .catch(error => {
                console.error(error);
                alert('Failed to load menu items');
            });
    }, [categoryId]);

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/menu/${categoryId}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify(newItem)
            });

            if (response.ok) {
                const addedItem = await response.json();
                setMenuItems([...menuItems, addedItem.data]);
                // Reset form
                setNewItem({ name: '', price: '', description: '' });
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Error adding menu item');
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            const response = await fetch(`/menu/${categoryId}/items/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                }
            });

            if (response.ok) {
                setMenuItems(menuItems.filter(item => item.id !== itemId));
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Error deleting menu item');
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    };

    const handleEditItem = async (itemId) => {
        const item = menuItems.find(item => item.id === itemId);
        const newName = prompt('Enter new item name', item.name);
        const newPrice = prompt('Enter new price', item.price);
        const newDescription = prompt('Enter new description', item.description);

        if (newName && newPrice) {
            try {
                const response = await fetch(`/menu/${categoryId}/items/${itemId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    },
                    body: JSON.stringify({
                        name: newName,
                        price: newPrice,
                        description: newDescription
                    })
                });

                if (response.ok) {
                    const updatedItem = await response.json();
                    setMenuItems(menuItems.map(item => 
                        item.id === itemId ? updatedItem.data : item
                    ));
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'Error updating menu item');
                }
            } catch (error) {
                console.error('Network error:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <button 
                    onClick={() => Inertia.visit('/admin/menu')} 
                    className="mb-4 flex items-center space-x-2 text-blue-500 hover:text-blue-700"
                >
                    <FaArrowLeft /> <span>Back to Categories</span>
                </button>

                <h1 className="text-2xl font-bold mb-4">
                    Menu Items for {categoryName}
                </h1>

                {/* Add New Item Form */}
                <form onSubmit={handleAddItem} className="mb-6 flex space-x-2">
                    <input
                        type="text"
                        placeholder="Item Name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                        className="border px-3 py-2 rounded flex-grow"
                        required
                    />
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={newItem.price}
                        onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                        className="border px-3 py-2 rounded w-24"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={newItem.description}
                        onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                        className="border px-3 py-2 rounded flex-grow"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Add Item
                    </button>
                </form>

                {/* Menu Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {menuItems.length > 0 ? (
                        menuItems.map((item) => (
                            <div 
                                key={item.id} 
                                className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-start"
                            >
                                <div>
                                    <h3 className="text-lg font-bold">{item.name}</h3>
                                    <p className="text-gray-600">${item.price}</p>
                                    {item.description && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEditItem(item.id)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 col-span-full text-center">
                            No items in this category yet.
                        </p>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}