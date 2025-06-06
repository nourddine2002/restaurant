import { useState } from 'react';
import { usePage,Link } from '@inertiajs/react';
import axios from 'axios';
import AdminLayout from "../../Layouts/AdminLayout";

export default function OrderSystem() {
  const { tables, menuItems, menuCategories, auth } = usePage().props;

  // State
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [order, setOrder] = useState({
    table_id:'',
    notes: '',
    items: []
  });
  const [screen, setScreen] = useState('categories'); // 'categories', 'items', 'tables', 'orderSummary'
  const [error, setError] = useState(null);
  const [showOrderPreview, setShowOrderPreview] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [previousScreen, setPreviousScreen] = useState(null); // Track previous screen for back navigation
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedItemForNote, setSelectedItemForNote] = useState(null);
  const [noteInput, setNoteInput] = useState('');


  // Get filtered menu items based on selected category
  const filteredMenuItems = selectedCategory 
    ? menuItems.filter(
        (item) =>
          item.category_id === selectedCategory ||
          item.menu_category_id === selectedCategory
      )
    : [];

  // Calculate total
  const totalAmount = order.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  // Functions
  const selectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setScreen('items');
  };

  const addItemToOrder = (menuItem) => {
    const existingIndex = order.items.findIndex(
      (item) => item.menu_item_id === menuItem.id
    );

    if (existingIndex !== -1) {
      const updatedItems = [...order.items];
      updatedItems[existingIndex].quantity += 1;
      setOrder({ ...order, items: updatedItems });
    } else {
      setOrder({
        ...order,
        items: [
          ...order.items,
          {
            menu_item_id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1
          }
        ]
      });
    }
  };

  const updateQuantity = (index, amount) => {
    const updatedItems = [...order.items];
    updatedItems[index].quantity = Math.max(1, updatedItems[index].quantity + amount);
    setOrder({ ...order, items: updatedItems });
  };

  const removeItem = (index) => {
    const updatedItems = [...order.items];
    updatedItems.splice(index, 1);
    setOrder({ ...order, items: updatedItems });
  };

  const showTables = () => {
    setPreviousScreen(screen);
    setScreen('tables');

  };

  const handleSubmit = async () => {
    if (order.items.length === 0) {
      setError("Please add at least one item to the order.");
      return;
    }
    if (!order.table_id) {
      setError("Please select a table before submitting.");
      showTables();
      return;
    }

    try {
      await axios.post('/api/orders', order);
      // Reset order after successful submission
      setOrder({
        table_id:'',
        notes: '',
        items: []
      });
      setScreen('categories');
      setError(null);
      // You could redirect here if needed
      // window.location.href = '/admin/orders';
    } catch (err) {
      setError("Failed to submit order. Please try again.");
      console.error(err);
    }
  };

  const selectTable = (tableId) => {
    setOrder({ ...order, table_id: tableId });
    setError(null);
    setScreen(previousScreen || 'categories');
  };

  const backToCategories = () => {
    setScreen('categories');
    setShowOrderPreview(false);
  };

  // Implementation for "AFFICHE" button - Show order preview/summary
  const showOrderSummary = () => {
    setScreen('orderSummary');
  };

  
  

  // Implementation for "+" button - Add a custom item or note
  const addCustomItem = () => {
    // You can implement a modal or prompt here
    const customItemName = prompt('Enter custom item name:');
    const customItemPrice = parseFloat(prompt('Enter price (DH):'));
    
    if (customItemName && !isNaN(customItemPrice) && customItemPrice > 0) {
      setOrder({
        ...order,
        items: [
          ...order.items,
          {
            menu_item_id: `custom-${Date.now()}`, // Create a unique ID
            name: customItemName,
            price: customItemPrice,
            quantity: 1,
            isCustom: true
          }
        ]
      });
    }
  };

  // Render functions
  const renderCategories = () => (
    <div className="pt-4">
    
      {showOrderPreview ? (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-bold mb-2">Order Summary</h2>
          {order.items.length === 0 ? (
            <p className="text-gray-500">No items in order</p>
          ) : (
            <>
              <div className="mb-2">
                <span className="font-semibold">Table: </span>
                {tables.find(t => t.id === order.table_id)?.number || 'Not selected'}
              </div>
              
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between py-1 border-b">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-600 ml-2">x{item.quantity}</span>
                  </div>
                  <div>{(item.price * item.quantity).toFixed(2)}DH</div>
                </div>
              ))}
              
              <div className="flex justify-between mt-3 pt-2 border-t font-bold">
                <div>Total:</div>
                <div>{totalAmount.toFixed(2)}DH</div>
              </div>
              
              <div className="mt-3 flex space-x-2">
                <button 
                  onClick={() => setShowOrderPreview(false)}
                  className="bg-gray-300 px-3 py-1 rounded"
                >
                  Close
                </button>
                <button 
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Place Order
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {menuCategories.map((category) => (
            <div 
              key={category.id} 
              className="cursor-pointer" 
              onClick={() => selectCategory(category.id)}
            >
              <div className="relative">
                <img 
                  src={category.image } 
                  alt={category.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className="absolute bottom-0 w-full bg-blue-500 bg-opacity-60 py-1 text-center">
                  {category.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {order.items.length > 0 && !showOrderPreview && (
        <>
        {/* Cancel Button */}
        <div className="fixed top-32  right-44 flex justify-center z-40">
          <button
            onClick={() => setShowCancelModal(true)}
            className="bg-red-600 text-white text-lg px-2 py-2 rounded-full shadow-md hover:bg-red-700 transition"
          >
          ❌ 
          </button>
        </div>
      
        {/* Total Price Bar */}
        <div className="fixed top-40 p-2 right-4 bg-blue-700 bg-opacity-90 py-3 text-center text-white font-semibold text-lg z-30 shadow-inner">
          Prix : {totalAmount.toFixed(2)}DH
        </div>
      </>
      )}
      
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
            <div className="bg-gray-300 p-4 h-36 flex flex-col justify-between relative">
            <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItemForNote(item);
                  setShowNoteModal(true);
                }}
                className=" absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded "
              >
                Note
              </button>
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
      
      {order.items.length > 0 && (
      <>
       {/* Cancel Button */}
      <div className="fixed top-32  right-44 flex justify-center z-40">
        <button
          onClick={() => setShowCancelModal(true)}
          className="bg-red-600 text-white text-lg px-2 py-2 rounded-full shadow-md hover:bg-red-700 transition"
        >
          ❌
        </button>
      </div>
    
       {/* Total Price Bar */}
      <div className="fixed top-40 p-2 right-4 bg-blue-700 bg-opacity-90 py-3 text-center text-white font-semibold text-lg z-30 shadow-inner">
        Prix : {totalAmount.toFixed(2)}DH
      </div>
    </>
    
      
      )}
      
      <div className="fixed bottom-0 left-0 right-0 flex p-2 bg-gray-200">
        <button 
          onClick={showOrderSummary}
          className="flex-1 bg-blue-500 py-2 rounded-md mr-1"
        >
          AFFICHE
        </button>
        <button 
          onClick={addCustomItem}
          className="w-12 bg-blue-500 rounded-full flex items-center justify-center text-2xl font-bold mx-2"
        >
          +
        </button>
        <button 
          onClick={handleSubmit}
          className="flex-1 bg-blue-500 py-2 rounded-md ml-1"
        >
          SEND
        </button>
      </div>
    </div>
  );

  const renderTables = () => (
    <div className="p-4 pb-16">
      <div className="flex items-center mb-4">
        <button 
          onClick={backToCategories} 
          className="text-2xl font-bold mr-2 text-blue-500"
        >
          &lt;&lt;
        </button>
        <div className="text-xl text-blue-500">Select Table</div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 ">
        {tables.map((table) => (
          <div 
            key={table.id} 
            disabled={!table.available}
            className="cursor-pointer" 
            onClick={() => selectTable(table.id)}
          >
            <div className={`${order.table_id === table.id ? 'bg-blue-400' : 'bg-blue-200'} p-4 h-24 flex items-center justify-center`}>
              <div className="text-center text-lg font-medium">
                Table {table.number}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  
  const renderOrderSummary = () => (
    <div className="p-4 pb-16">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
  
      <div className="mb-2">
        <span className="font-semibold">Table: </span>
        {tables.find(t => t.id === order.table_id)?.number || 'Not selected'}
      </div>
  
      {order.items.length === 0 ? (
        <>
          <p className="text-gray-500">No items in order</p>
          <button
            onClick={() => setScreen('items')}
            className="bg-gray-300 px-3 py-1 rounded"
          >
            Back
          </button>
        </>
      ) : (
        <>
          {order.items.map((item, index) => (
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
                  onClick={() => {
                    removeItem(index);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
                  title="Remove item"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
  
          <div className="flex justify-between mt-3 pt-2 border-t font-bold">
            <div>Total:</div>
            <div>{totalAmount.toFixed(2)}DH</div>
          </div>
  
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => setScreen('items')}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
  
  // Main render
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-4">
  <div className="text-xl font-bold text-gray-800">
    Server: <span className="text-blue-600">{auth.user.username}</span>
    </div>
    <div className="text-xl font-bold text-gray-800">
    Tabel: <span className="text-blue-600">{tables.filter(table => table.id === order.table_id)
        .map(table => table.number)
        .join(', ')}</span>
        
  </div>
  
  
  <button 
          onClick={showTables} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          🍽️ TABLES
        </button>
</div>
    <div className="p-4 bg-gray-100 min-h-screen">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 m-4 rounded border border-red-400">
          {error}
        </div>
      )}
      
      {screen === 'categories' && renderCategories()}
      {screen === 'items' && renderItems()}
      {screen === 'tables' && renderTables()}
      {screen === 'orderSummary' && renderOrderSummary()}
      
      {showCancelModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg bg-opacity-60 shadow-md text-center max-w-sm w-full">
      <h2 className="text-lg font-semibold mb-4">Cancel Order</h2>
      <p className="text-gray-700 mb-6">Are you sure you want to cancel this order?</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => {
            setOrder({
            table_id:'', // Reset to default table
            notes: '',
            items: [] });
            setScreen('categories'); 
            setShowCancelModal(false);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Yes, Cancel
        </button>
        <button
          onClick={() => setShowCancelModal(false)}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
        >
          No, Go Back
        </button>
      </div>
    </div>
  </div>
)}
{showNoteModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded-lg w-80 shadow-lg">
      <h2 className="text-lg font-bold mb-2">Add Note for {selectedItemForNote.name}</h2>
      <input 
        type="text"
        placeholder="Enter note"
        value={noteInput}
        onChange={(e) => setNoteInput(e.target.value)}
        className="w-full border rounded px-2 py-1 mb-4"
      />
      <div className="flex justify-end space-x-2">
        <button
          className="px-3 py-1 bg-gray-300 rounded"
          onClick={() => setShowNoteModal(false)}
        >
          Cancel
        </button>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => {
            addItemToOrder({ ...selectedItemForNote, note: noteInput });
            setShowNoteModal(false);
            setNoteInput('');
          }}
        >
          Add
        </button>
      </div>
    </div>
  </div>
)}



    </div>
    </AdminLayout>
  );
}