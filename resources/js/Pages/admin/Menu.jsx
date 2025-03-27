import AdminLayout from "../../Layouts/AdminLayout";
import { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { FaEdit, FaTrash } from "react-icons/fa";

const Menu = () => {
    const [name, setName] = useState("");
    const [categories, setCategories] = useState([]);

    // Fetch categories when component mounts
    useEffect(() => {
        fetch("/menu-categories")
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch categories");
                return response.json();
            })
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
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Error adding menu category");
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    };

    const handleDelete = async (categoryId) => {
        try {
            const response = await fetch(`/menu-categories/${categoryId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
                },
            });

            if (response.ok) {
                setCategories(categories.filter(category => category.id !== categoryId));
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Error deleting menu category");
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    };

    const handleEdit = async (categoryId, newName) => {
        try {
            const response = await fetch(`/menu-categories/${categoryId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({ name: newName }),
            });

            if (response.ok) {
                const updatedCategory = await response.json();
                setCategories(categories.map(category =>
                    category.id === categoryId ? updatedCategory.data : category
                ));
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Error updating menu category");
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Manage Menu</h1>
                <p>Here you can edit and update the restaurant menu.</p>
            </div>
            <div>
                <a href="/admin" className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                    ← Back to Dashboard
                </a>
            </div>

            <div className="flex items-center space-x-4 mb-2 p-8">
                <input
                    type="text"
                    placeholder="Category Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border px-3 py-2 rounded mr-2 "
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
                                onClick={() => Inertia.visit(`/menu/${category.id}`)} // Navigate to menu items page for specific category
                                className="text-lg font-bold hover:bg-gray-200 transition w-full text-left"
                            >
                                {category.name}
                            </button>

                            <div className="flex space-x-2">
                                <button
                                    className="text-blue-500"
                                    onClick={() => {
                                        const newName = prompt("Enter new category name", category.name);
                                        if (newName) handleEdit(category.id, newName);
                                    }}
                                >
                                    <FaEdit />
                                </button>

                                <button
                                    className="text-red-500"
                                    onClick={() => handleDelete(category.id)}
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
        </AdminLayout>
    );
};

export default Menu;