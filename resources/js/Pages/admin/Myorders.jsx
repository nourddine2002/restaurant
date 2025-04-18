    import { useState } from 'react';
    import { usePage, Link } from '@inertiajs/react';
    import axios from 'axios';
    import AdminLayout from '../../Layouts/AdminLayout';

    export default function MyOrders({ orders, tables, menuItems, menuCategories }) {
    const { auth } = usePage().props;

    // State
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [screen, setScreen] = useState('ordersList'); // 'ordersList', 'categories', 'items', 'orderSummary'
    const [error, setError] = useState(null);
    const [newItems, setNewItems] = useState([]);

    // Get filtered menu items based on selected category
    const filteredMenuItems = selectedCategory 
        ? menuItems.filter(
            (item) =>
            item.category_id === selectedCategory ||
            item.menu_category_id === selectedCategory
        )
        : [];

    // Calculate total for additional items
    const additionalTotal = newItems.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
    );

    // Functions
    const selectOrder = (order) => {
        setSelectedOrder(order);
        setNewItems([]);
        setScreen('categories');
    };

    const selectCategory = (categoryId) => {
        setSelectedCategory(categoryId);
        setScreen('items');
    };

    const addItemToOrder = (menuItem) => {
        const existingIndex = newItems.findIndex(
        (item) => item.menu_item_id === menuItem.id
        );

        if (existingIndex !== -1) {
        const updatedItems = [...newItems];
        updatedItems[existingIndex].quantity += 1;
        setNewItems(updatedItems);
        } else {
        setNewItems([
            ...newItems,
            {
            menu_item_id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1
            }
        ]);
        }
    };

    const updateQuantity = (index, amount) => {
        const updatedItems = [...newItems];
        updatedItems[index].quantity = Math.max(1, updatedItems[index].quantity + amount);
        setNewItems(updatedItems);
    };

    const removeItem = (index) => {
        const updatedItems = [...newItems];
        updatedItems.splice(index, 1);
        setNewItems(updatedItems);
    };

    const backToOrders = () => {
        setScreen('ordersList');
        setSelectedOrder(null);
        setNewItems([]);
    };

    const backToCategories = () => {
        setScreen('categories');
    };

    const showOrderSummary = () => {
        setScreen('orderSummary');
    };

    const addCustomItem = () => {
        const customItemName = prompt('Enter custom item name:');
        const customItemPrice = parseFloat(prompt('Enter price (DH):'));
        
        if (customItemName && !isNaN(customItemPrice) && customItemPrice > 0) {
        setNewItems([
            ...newItems,
            {
            menu_item_id: `custom-${Date.now()}`, // Create a unique ID
            name: customItemName,
            price: customItemPrice,
            quantity: 1,
            isCustom: true
            }
        ]);
        }
    };

    const submitAddItems = async () => {
        if (newItems.length === 0) {
        setError("Please add at least one item to the order.");
        return;
        }

        try {
        // Format the items for the API
        const formattedItems = newItems.map(item => ({
            menu_item_id: item.menu_item_id,
            quantity: item.quantity,
            notes: item.notes || ''
        }));

        await axios.post(`/api/orders/${selectedOrder.id}/add-items`, {
            items: formattedItems
        });

        // Reset after successful submission
        setNewItems([]);
        setScreen('ordersList');
        setSelectedOrder(null);
        setError(null);
        
        // Refresh the page to show updated orders
        window.location.reload();
        } catch (err) {
        setError("Failed to add items to order. Please try again.");
        console.error(err);
        }
    };

    // Check if order can be modified (not Paid or Canceled)
    const canModifyOrder = (order) => {
        return !['Paid', 'Canceled'].includes(order.status);
    };

    // Get status class for styling
    const getStatusClass = (status) => {
        switch (status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Preparing': return 'bg-blue-100 text-blue-800';
        case 'Ready': return 'bg-green-100 text-green-800';
        case 'Served': return 'bg-purple-100 text-purple-800';
        case 'Paid': return 'bg-gray-100 text-gray-800';
        case 'Canceled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Render functions
    const renderOrdersList = () => (
        <div className="p-4 pb-16">
        <h2 className="text-xl font-bold mb-4">My Orders</h2>
        
        {orders.length === 0 ? (
            <div className="text-center py-8">
            <p className="text-gray-500">You don't have any orders yet.</p>
            </div>
        ) : (
            <div className="space-y-4">
            {orders.map((order) => (
                <div key={order.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-2">
                    <div>
                    <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleString()}
                    </p>
                    </div>
                    <div>
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusClass(order.status)}`}>
                        {order.status}
                    </span>
                    </div>
                </div>
                
                <div className="mb-2">
                    <span className="font-medium">Table: </span>
                    {order.table?.number || 'N/A'}
                </div>
                
                <div className="mb-2">
                    <span className="font-medium">Items: </span>
                    {order.order_items.length}
                </div>
                
                <div className="mb-2">
                    <span className="font-medium">Total: </span>
                    {order.total_amount}DH
                </div>
                
                {canModifyOrder(order) && (
                    <button
                    onClick={() => selectOrder(order)}
                    className="w-full mt-2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                    >
                    Add More Items
                    </button>
                )}
                </div>
            ))}
            </div>
        )}
        </div>
    );

    const renderCategories = () => (
        <div className="pt-0">
        <div className="flex items-center mb-4">
            <button 
            onClick={backToOrders} 
            className="text-2xl font-bold mr-2 text-blue-500"
            >
            &lt;&lt;
            </button>
            <div className="text-xl font-bold text-blue-500">
            Order #{selectedOrder.id} - Add Items
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            {menuCategories.map((category) => (
            <div 
                key={category.id} 
                className="cursor-pointer" 
                onClick={() => selectCategory(category.id)}
            >
                <div className="relative">
                <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-40 object-cover rounded-lg"
                />
                <div className="absolute bottom-0 w-full bg-blue-500 bg-opacity-60 py-1 text-center text-white">
                    {category.name}
                </div>
                </div>
            </div>
            ))}
        </div>
        
        {newItems.length > 0 && (
            <div className="fixed bottom-20 left-0 right-0 bg-blue-500 py-2 text-center text-white">
            Prix : {additionalTotal.toFixed(2)}DH
            </div>
        )}
        
        <div className="fixed bottom-0 left-0 right-0 flex p-2 bg-white shadow-200">
            <button 
            onClick={showOrderSummary}
            className="flex-1 bg-blue-500 text-white py-2 rounded-md mr-1"
            >
            AFFICHE
            </button>
            <button 
            onClick={addCustomItem}
            className="w-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-2"
            >
            +
            </button>
            <button 
            onClick={submitAddItems}
            className="flex-1 bg-blue-500 text-white py-2 rounded-md ml-1"
            >
            SEND
            </button>
        </div>
        </div>
    );

    const renderItems = () => (
        <div className="p-4 pb-24">
        <div className="flex items-center mb-4">
            <button 
            onClick={backToCategories} 
            className="text-2xl font-bold mr-2 text-blue-500"
            >
            &lt;&lt;
            </button>
            <div className="text-xl font-bold text-blue-500">
            {menuCategories.find(c => c.id === selectedCategory)?.name}
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            {filteredMenuItems.map((item) => (
            <div 
                key={item.id} 
                className="cursor-pointer" 
                onClick={() => addItemToOrder(item)}
            >
                <div className="bg-gray-300 p-4 h-36 flex flex-col justify-between">
                <div className="text-center text-lg font-medium">
                    {item.name}
                </div>
                <div className="text-center text-lg">
                    {item.price}DH
                </div>
                </div>
            </div>
            ))}
        </div>
        
        {newItems.length > 0 && (
            <div className="fixed bottom-20 left-0 right-0 bg-blue-500 bg-opacity-60 py-2 text-center text-white">
            Prix : {additionalTotal.toFixed(2)}DH
            </div>
        )}
        
        <div className="fixed bottom-0 left-0 right-0 flex p-2 bg-white shadow-200">
            <button 
            onClick={showOrderSummary}
            className="flex-1 bg-blue-500 text-white py-2 rounded-md mr-1"
            >
            AFFICHE
            </button>
            <button 
            onClick={addCustomItem}
            className="w-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-2"
            >
            +
            </button>
            <button 
            onClick={submitAddItems}
            className="flex-1 bg-blue-500 text-white py-2 rounded-md ml-1"
            >
            SEND
            </button>
        </div>
        </div>
    );

    const renderOrderSummary = () => (
        <div className="p-4 pb-16">
        <div className="flex items-center mb-4">
            <button 
            onClick={backToCategories} 
            className="text-2xl font-bold mr-2 text-blue-500"
            >
            &lt;&lt;
            </button>
            <h2 className="text-xl font-bold">Additional Items Summary</h2>
        </div>
    
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="mb-2">
            <span className="font-semibold">Order #: </span>
            {selectedOrder.id}
            </div>
            
            <div className="mb-2">
            <span className="font-semibold">Table: </span>
            {selectedOrder.table?.number || 'Not selected'}
            </div>
            
            <div className="mb-2">
            <span className="font-semibold">Original Order Total: </span>
            {selectedOrder.total_amount}DH
            </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-bold mb-2">New Items to Add:</h3>
            
            {newItems.length === 0 ? (
            <p className="text-gray-500">No items added yet</p>
            ) : (
            <>
                {newItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-1 border-b">
                    <div className="flex items-center space-x-2">
                    <span className="font-medium">{item.name}</span>
                    <div className="flex items-center border rounded">
                        <button 
                        onClick={() => updateQuantity(index, -1)}
                        className="px-2 py-0 border-r"
                        >
                        -
                        </button>
                        <span className="px-2">{item.quantity}</span>
                        <button 
                        onClick={() => updateQuantity(index, 1)}
                        className="px-2 py-0 border-l"
                        >
                        +
                        </button>
                    </div>
                    </div>
                    <div className="flex items-center space-x-2">
                    <span>{(item.price * item.quantity).toFixed(2)}DH</span>
                    <button
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700"
                    >
                        ❌
                    </button>
                    </div>
                </div>
                ))}
            
                <div className="flex justify-between mt-3 pt-2 border-t font-bold">
                <div>Additional Total:</div>
                <div>{additionalTotal.toFixed(2)}DH</div>
                </div>
                
                <div className="flex justify-between mt-1 pt-1">
                <div>New Order Total:</div>
                <div>{(parseFloat(selectedOrder.total_amount) + additionalTotal).toFixed(2)}DH</div>
                </div>
            </>
            )}
        </div>
        
        <div className="mt-4">
            <button
            onClick={submitAddItems}
            disabled={newItems.length === 0}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
            >
            Add to Order
            </button>
        </div>
        </div>
    );

    // Main render
    return (
        <AdminLayout>
        <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-bold text-gray-800">
            Server: <span className="text-blue-600">{auth.user.username || auth.user.name}</span>
            </div>
            {selectedOrder && (
            <div className="text-xl font-bold text-gray-800">
                Table: <span className="text-blue-600">{selectedOrder.table?.number}</span>
            </div>
            )}
            <Link href="/admin/orders/create" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Menu
            </Link>
        </div>
        
        <div className="bg-gray-100 min-h-screen">
            {error && (
            <div className="bg-red-100 text-red-700 p-3 m-4 rounded border border-red-400">
                {error}
            </div>
            )}
            
            {screen === 'ordersList' && renderOrdersList()}
            {screen === 'categories' && renderCategories()}
            {screen === 'items' && renderItems()}
            {screen === 'orderSummary' && renderOrderSummary()}
        </div>
        </AdminLayout>
    );
    }