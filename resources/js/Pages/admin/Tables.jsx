import AdminLayout from "../../Layouts/AdminLayout";
import { Link, useForm } from "@inertiajs/react";
import { FaTable, FaEdit, FaTrash, FaCheck, FaPlus } from "react-icons/fa";
import { useState } from "react";

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

    const handleAddTable = (e) => {
        e.preventDefault();
        if (!newTableData.table_number) return;
        post(route("admin.tables.store"), { onSuccess: resetNewTable });
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
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Manage Tables</h1>
                <p>Here you can manage restaurant seating.</p>
            </div>

            <div className="flex items-center justify-between mb-4 p-6">
                <Link href="/admin" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    ← Back to Dashboard
                </Link>

                <form onSubmit={handleAddTable} className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="New Table Number"
                        value={newTableData.table_number}
                        onChange={(e) => setNewTableData("table_number", e.target.value)}
                        className="border px-3 py-2 rounded"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-green-600 flex items-center"
                        disabled={addProcessing}
                    >
                        <FaPlus className="mr-1" /> Add Table
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
                {tables.length > 0 ? (
                    tables.map((table) => (
                        <div key={table.id} className="relative bg-gray-100 shadow-md p-6 rounded-lg flex flex-col items-center justify-center">
                            <button
                                onClick={() => handleEdit(table.id, table.number)}
                                className="absolute top-2 left-2 bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                            >
                                <FaEdit />
                            </button>

                            <FaTable className="text-4xl text-gray-700" />

                            {editMode === table.id ? (
                                <div className="flex items-center space-x-2 mt-2">
                                    <input
                                        type="number"
                                        value={editData.table_number}
                                        onChange={(e) => setEditData("table_number", e.target.value)}
                                        className="text-lg font-bold border rounded px-2"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => handleSave(table.id)}
                                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                                        disabled={editProcessing}
                                    >
                                        <FaCheck />
                                    </button>
                                </div>
                            ) : (
                                <p className="mt-2 text-lg font-bold">{table.number}</p>
                            )}

                            <button
                                onClick={() => handleDelete(table.id)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center col-span-full">No tables available.</p>
                )}
            </div>

            {/* MODAL DE CONFIRMATION */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete this table? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Tables;
