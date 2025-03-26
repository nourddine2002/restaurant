import AdminLayout from "../../Layouts/AdminLayout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Menu = () => {
    const [name, setName] = useState("");
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    // Fetch categories when component mounts
    useEffect(() => {
        fetch("/menu-categories")
            .then((response) => response.json())
            .then((data) => setCategories(data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            setCategories([...categories, newCategory.data]); // Update UI
            setName(""); // Reset input
        } else {
            alert("Error adding menu category");
        }
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Manage Menu</h1>
                <p>Here you can edit and update the restaurant menu.</p>
            </div>
            <div>
                <a href="/admin" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                    ← Back to Dashboard
                </a>
            </div>

            {/* Form to add a category */}
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

            {/* Display categories as buttons */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => navigate(`/menu/${category.id}`)}
                            className="bg-gray-100 shadow-md p-6 rounded-lg flex items-center justify-center text-lg font-bold hover:bg-gray-200 transition"
                        >
                            {category.name}
                        </button>
                    ))
                ) : (
                    <p className="text-gray-500 text-center col-span-full">No categories available.</p>
                )}
            </div>
        </AdminLayout>
    );
};

export default Menu;
