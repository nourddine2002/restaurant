import AdminLayout from "../../Layouts/AdminLayout";
import { Link, useForm } from "@inertiajs/react";
import { FaCheck, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { MdTableBar } from 'react-icons/md'



const Tables = ({ tables }) => {
    const { data: newTableData, setData: setNewTableData, post, processing: addProcessing, reset: resetNewTable } = useForm({
        table_number: "",
    });

    const { data: editData, setData: setEditData, put, processing: editProcessing, delete: destroy } = useForm({
        table_number: "",
    });

    const [editMode, setEditMode] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTableId, setSelectedTableId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const handleAddTable = (e) => {
        e.preventDefault();
        if (!newTableData.table_number) return;
        post(route("admin.tables.store"), { 
            onSuccess: () => {
                resetNewTable();
                setShowAddForm(false); // Hide form after successful addition
            } 
        });
    };
    


    const handleEdit = (tableId, currentNumber) => {
        setEditMode(tableId);
        setEditData("table_number", currentNumber);
    };

    const handleSave = (tableId) => {
        if (!editData.table_number) return;
        put(route("admin.tables.update", tableId), { onSuccess: () => setEditMode(null) });
    };

    const handleDelete = (tableId) => {
        setSelectedTableId(tableId);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedTableId) {
            destroy(route("admin.tables.destroy", selectedTableId), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setSelectedTableId(null);
                },
            });
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Tables Management</h1>
                    <div className="space-x-3">
                        <Link href="/admin" className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition">
                            ← Back to Dashboard
                        </Link>
                        <button onClick={() => setShowAddForm(!showAddForm)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                            {showAddForm ? 'Cancel' : 'Add New Table'}
                        </button>
                    </div>
                </div>

                {showAddForm && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Table</h3>
                        <form onSubmit={handleAddTable} className="space-y-4">
                            <input type="text" placeholder="New Table Number" value={newTableData.table_number} 
                                onChange={(e) => setNewTableData("table_number", e.target.value)} 
                                className="w-full border px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center" disabled={addProcessing}>
                                <FaPlus className="mr-2" /> Add Table
                            </button>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="p-3 text-center">Tabel</th>
                                <th className="p-3 text-center">ID-Tabel</th>
                                <th className="p-3 text-center">Table Number</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tables.map((table) => (
                                <tr key={table.id} className=" border-t hover:bg-gray-50 transition">
                                    <td className="p-3 flex items-center justify-center text-center"><MdTableBar/></td>
                                    <td className="p-3 text-center">{table.id}</td>
                                    <td className="p-3 text-center font-semibold text-gray-800 m-auto">
                                        {editMode === table.id ? (
                                            <input type="text" value={editData.table_number} 
                                                onChange={(e) => setEditData("table_number", e.target.value)} 
                                                className="border-b-2 border-blue-500 focus:outline-none w-16 text-center" autoFocus />
                                        ) : (
                                            <span>{table.number}</span>
                                        )}
                                    </td>
                                    <td className="p-3 flex justify-center space-x-4">
                                        {editMode === table.id ? (
                                            <button onClick={() => handleSave(table.id)} className=" p-4 text-blue-600 hover:text-blue-700">
                                                <FaCheck />
                                            </button>
                                        ) : (
                                            <button onClick={() => handleEdit(table.id, table.number)} className="text-blue-600 hover:text-blue-700">
                                                <FaEdit />
                                            </button>
                                        )}
                                        <button onClick={() => handleDelete(table.id)} className="text-red-600 hover:text-red-900 font-medium">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete this table?</h2>
                            <div className="flex justify-end space-x-4">
                                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition">
                                    Cancel
                                </button>
                                <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Tables;
