import AdminLayout from "../../Layouts/AdminLayout";
import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaList } from "react-icons/fa";
import { Link } from '@inertiajs/react';


const Menu = () => {
    const [name, setName] = useState("");
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryItems, setCategoryItems] = useState([]);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);


    useEffect(() => {
        fetch("/menu-categories")
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error(error));
    }, []);

    const fetchCategoryItems = async (categoryId) => {
        try {
            const response = await fetch(`/menu-items/${categoryId}`);
            const data = await response.json();
            setCategoryItems(data);
            setSelectedCategory(categoryId);
            setIsItemModalOpen(true);
        } catch (error) {
            console.error("Error fetching category items:", error);
            alert("Could not fetch items for this category.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

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
                setIsAddFormVisible(false);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred.");
        }
    };

    const confirmDelete = (categoryId) => {
        setCategoryToDelete(categoryId);
        setIsModalOpen(true);
    };

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
                setCategories(categories.filter((cat) => cat.id !== categoryToDelete));
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred.");
        } finally {
            setIsModalOpen(false);
            setCategoryToDelete(null);
        }
    };

    const openEditModal = (category) => {
        setCategoryToEdit(category);
        setIsEditModalOpen(true);
    };

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
                setCategories(
                    categories.map((cat) => (cat.id === categoryToEdit.id ? updatedCategory.data : cat))
                );
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
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Menu Categories Management</h1>
                    <div className="space-x-3">
                        <a
                            href="/admin"
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                        >
                            ← Back to Dashboard
                        </a>
                        <button
                            onClick={() => setIsAddFormVisible(!isAddFormVisible)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                            {isAddFormVisible ? "Cancel" : "Add New Category"}
                        </button>
                    </div>
                </div>

                {/* Add Category Form */}
                {isAddFormVisible && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Category</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Category Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center"
                            >
                                <FaPlus className="mr-2" /> Add Category
                            </button>
                        </form>
                    </div>
                )}

                {/* Categories Table */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="p-3 text-center">ID</th>
                                <th className="p-3 text-center">Category Name</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <tr key={category.id} className="border-t hover:bg-gray-50 transition">
                                        <td 
                                            className="p-3 text-center cursor-pointer"
                                            onClick={() => fetchCategoryItems(category.id)}
                                        >
                                            {category.id}
                                        </td>
                                        <td 
                                            className="p-3 text-center font-semibold text-gray-800 cursor-pointer"
                                            onClick={() => fetchCategoryItems(category.id)}
                                        >
                                            {category.name}
                                        </td>
                                        <td className="p-3 flex justify-center space-x-4">
                                            <button
                                                onClick={() => fetchCategoryItems(category.id)}
                                                className="text-blue-600 hover:text-green-700"
                                                title="View Items"
                                            >
                                                <FaList />
                                            </button>
                                            <button
                                                
                                                className="text-blue-600 hover:text-green-700"
                                                title="View Items"
                                            >
                                                <Link href={`/admin/menu/category/${category.id}/items`} className="text-blue-600 hover:text-green-700">
                                                <FaPlus />
                                                </Link>
                                            </button>


                                            <button
                                                onClick={() => openEditModal(category)}
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(category.id)}
                                                className="text-red-600 hover:text-red-900 font-medium"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center text-gray-500 py-4">
                                        No categories available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Items Modal */}
                {isItemModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">
                                    Items in {categories.find(c => c.id === selectedCategory)?.name}
                                </h2>
                                <button
                                    onClick={() => setIsItemModalOpen(false)}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Close
                                </button>
                            </div>
                            
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 text-left">Name</th>
                                        <th className="p-2 text-left">Price</th>
                                        <th className="p-2 text-left">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categoryItems.map((item) => (
                                        <tr key={item.id} className="border-t">
                                            <td className="p-2">{item.name}</td>
                                            <td className="p-2">${item.price.toFixed(2)}</td>
                                            <td className="p-2">{item.description}</td>
                                        </tr>
                                    ))}
                                    {categoryItems.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="text-center p-4 text-gray-500">
                                                No items in this category
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold mb-4">
                                Are you sure you want to delete this category?
                            </h2>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-md w-96">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Category</h3>
                            <input
                                type="text"
                                value={categoryToEdit?.name || ""}
                                onChange={(e) =>
                                    setCategoryToEdit({ ...categoryToEdit, name: e.target.value })
                                }
                                className="w-full border px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                            />
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
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
            </div>
        </AdminLayout>
    );
};

export default Menu;