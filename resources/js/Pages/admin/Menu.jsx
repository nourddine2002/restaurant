import AdminLayout from "../../Layouts/AdminLayout";
import { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { FaEdit, FaTrash } from "react-icons/fa";

const Menu = () => {
    const [name, setName] = useState("");
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);

    useEffect(() => {
        fetch("/menu-categories")
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error(error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/menu-categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({ name }),
            });

            if (response.ok) {
                const newCategory = await response.json();
                setCategories([...categories, newCategory.data]);
                setName("");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred.");
        }
    };

    // Ouvrir le modal de suppression
    const confirmDelete = (categoryId) => {
        setCategoryToDelete(categoryId);
        setIsModalOpen(true);
    };

    // Supprimer une catégorie
    const handleDelete = async () => {
        if (!categoryToDelete) return;
        try {
            const response = await fetch(`/menu-categories/${categoryToDelete}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
                },
            });

            if (response.ok) {
                setCategories(categories.filter(category => category.id !== categoryToDelete));
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred.");
        } finally {
            setIsModalOpen(false);
            setCategoryToDelete(null);
        }
    };

    // Ouvrir le modal de modification
    const openEditModal = (category) => {
        setCategoryToEdit(category);
        setIsEditModalOpen(true);
    };

    // Modifier une catégorie
    const handleEdit = async () => {
        if (!categoryToEdit || !categoryToEdit.name.trim()) return;

        try {
            const response = await fetch(`/menu-categories/${categoryToEdit.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({ name: categoryToEdit.name }),
            });

            if (response.ok) {
                const updatedCategory = await response.json();
                setCategories(categories.map(category =>
                    category.id === categoryToEdit.id ? updatedCategory.data : category
                ));
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred.");
        } finally {
            setIsEditModalOpen(false);
            setCategoryToEdit(null);
        }
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Manage Menu</h1>
            </div>

            <div className="flex items-center space-x-2 mb-4">
                <input
                    type="text"
                    placeholder="Category Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border px-3 py-2 rounded"
                    required
                />
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Add Category
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between bg-gray-100 shadow-md p-6 rounded-lg">
                            <button
                                onClick={() => Inertia.visit(`/menu/${category.id}/items`)}
                                className="text-lg font-bold hover:bg-gray-200 transition"
                            >
                                {category.name}
                            </button>

                            <div className="flex space-x-2">
                                <button
                                    className="text-blue-500"
                                    onClick={() => openEditModal(category)}
                                >
                                    <FaEdit />
                                </button>

                                <button
                                    className="text-red-500"
                                    onClick={() => confirmDelete(category.id)}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center col-span-full">No categories available.</p>
                )}
            </div>

            {/* Modal de confirmation de suppression */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete this category? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de modification */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Category</h3>
                        <input
                            type="text"
                            value={categoryToEdit.name}
                            onChange={(e) => setCategoryToEdit({ ...categoryToEdit, name: e.target.value })}
                            className="border px-3 py-2 rounded w-full mb-4"
                        />
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Menu;
