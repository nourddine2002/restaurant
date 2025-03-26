import AdminLayout from "../../Layouts/AdminLayout";
import { Link, useForm } from "@inertiajs/react";
import { FaTable, FaEdit, FaTrash, FaCheck, FaPlus } from "react-icons/fa";
import { useState } from "react";

const Tables = ({ tables }) => {
    // Formulaire pour la nouvelle table
    const { data: newTableData, setData: setNewTableData, post, processing: addProcessing, reset: resetNewTable } = useForm({
        table_number: "",
    });

    // Formulaire pour l'édition de table
    const { data: editData, setData: setEditData, put, processing: editProcessing, delete: destroy } = useForm({
        table_number: "",
    });

    const [editMode, setEditMode] = useState(null);

    // Ajout d'une nouvelle table
    const handleAddTable = (e) => {
        e.preventDefault();

        // Vérifier que le champ n'est pas vide
        if (!newTableData.table_number) return;

        // Envoyer la requête
        post(route("admin.tables.store"), {
            onSuccess: () => {
                resetNewTable();
            },
        });
    };

    // Modification d'une table
    const handleEdit = (tableId, currentNumber) => {
        setEditMode(tableId);
        setEditData("table_number", currentNumber);
    };

    // Sauvegarde des modifications
    const handleSave = (tableId) => {
        if (!editData.table_number) return;

        put(route("admin.tables.update", tableId), {
            onSuccess: () => {
                setEditMode(null);
            },
        });
    };

    // Suppression d'une table - CORRECTION ICI
    const handleDelete = (tableId) => {
        if (confirm("Are you sure you want to delete this table?")) {
            destroy(route("admin.tables.destroy", tableId));
        }
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Manage Tables</h1>
                <p>Here you can manage restaurant seating.</p>
            </div>

            {/* Ajouter une nouvelle table */}
            <div className="flex items-center justify-between mb-4 p-6">
                <Link href="/admin" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    ← Back to Dashboard
                </Link>

                <form onSubmit={handleAddTable} className="flex items-center space-x-2">
                    <input
                        type="number"
                        placeholder="New Table Number"
                        value={newTableData.table_number}
                        onChange={(e) => setNewTableData("table_number", e.target.value)}
                        className="border px-3 py-2 rounded"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                        disabled={addProcessing}
                    >
                        <FaPlus className="mr-1" /> Add Table
                    </button>
                </form>
            </div>

            {/* Afficher les tables */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
                {tables.length > 0 ? (
                    tables.map((table) => (
                        <div
                            key={table.id}
                            className="relative bg-gray-100 shadow-md p-6 rounded-lg flex flex-col items-center justify-center"
                        >
                            {/* Bouton Modifier */}
                            <button
                                onClick={() => handleEdit(table.id, table.number)}
                                className="absolute top-2 left-2 bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                            >
                                <FaEdit />
                            </button>

                            {/* Icône Table */}
                            <FaTable className="text-4xl text-gray-700" />

                            {/* Numéro de table (éditable) */}
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

                            {/* Bouton Supprimer */}
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
        </AdminLayout>
    );
};

export default Tables;
