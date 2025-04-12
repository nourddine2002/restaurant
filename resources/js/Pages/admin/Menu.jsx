import AdminLayout from "../../Layouts/AdminLayout";
import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaList, FaImage } from "react-icons/fa";
import { Link } from '@inertiajs/react';

const Menu = () => {
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState(null);
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryItems, setCategoryItems] = useState([]);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const fetchCategories = async () => {
        try {
            const response = await fetch("/api/menu-categories");
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategoryItems = async (categoryId) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/menu-items/${categoryId}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            setCategoryItems(Array.isArray(data) ? data : []);
            setSelectedCategory(categoryId);
            setIsItemModalOpen(true);
        } catch (error) {
            console.error("Error fetching category items:", error);
            alert("Could not fetch items for this category.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.match('image.*')) {
                setErrors({...errors, image: 'Please select a valid image file (JPEG, PNG, JPG, GIF)'});
                return;
            }
            
            // Validate file size
            if (file.size > 2 * 1024 * 1024) { // 2MB
                setErrors({...errors, image: 'Image size should be less than 2MB'});
                return;
            }
            
            setImage(file);
            setErrors({...errors, image: null});
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.match('image.*')) {
                setErrors({...errors, editImage: 'Please select a valid image file (JPEG, PNG, JPG, GIF)'});
                return;
            }
            
            // Validate file size
            if (file.size > 2 * 1024 * 1024) { // 2MB
                setErrors({...errors, editImage: 'Image size should be less than 2MB'});
                return;
            }
            
            setCategoryToEdit({
                ...categoryToEdit,
                image: file
            });
            setErrors({...errors, editImage: null});
            
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Validate form
        let formErrors = {};
        if (!name.trim()) formErrors.name = 'Category name is required';
        if (!image) formErrors.image = 'Category image is required';
        
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            setIsLoading(false);
            return;
        }
        
        const formData = new FormData();
        formData.append('name', name);
        if (image) formData.append('image', image);
        
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const response = await fetch('/api/menu-categories', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: formData,
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create category');
            }
            
            const result = await response.json();
            setCategories([...categories, result.data]);
            setName('');
            setImage(null);
            setImagePreview(null);
            setIsAddFormVisible(false);
            setErrors({});
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Failed to create category');
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDelete = (categoryId) => {
        setCategoryToDelete(categoryId);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!categoryToDelete) return;
        setIsLoading(true);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const response = await fetch(`/api/menu-categories/${categoryToDelete}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                    "Accept": "application/json"
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete category');
            }

            setCategories(categories.filter((cat) => cat.id !== categoryToDelete));
        } catch (error) {
            console.error(error);
            alert(error.message || "An error occurred during deletion.");
        } finally {
            setIsModalOpen(false);
            setCategoryToDelete(null);
            setIsLoading(false);
        }
    };

    const openEditModal = (category) => {
        setCategoryToEdit({
            ...category,
            // Keep original attributes
            originalImage: category.image
        });
        setEditImagePreview(category.image || null);
        setIsEditModalOpen(true);
        setErrors({});
    };

    const handleEdit = async () => {
        if (!categoryToEdit) return;
        setIsLoading(true);
        
        // Validate form
        let formErrors = {};
        if (!categoryToEdit.name?.trim()) formErrors.editName = 'Category name is required';
        
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            setIsLoading(false);
            return;
        }
        
        const formData = new FormData();
        formData.append('name', categoryToEdit.name);
        formData.append('_method', 'PUT');
        
        // Only append image if it's a new file (not just a URL string)
        if (categoryToEdit.image instanceof File) {
            formData.append('image', categoryToEdit.image);
        }
        
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const response = await fetch(`/api/menu-categories/${categoryToEdit.id}`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: formData,
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Update failed');
            }
            
            const updatedCategory = await response.json();
            
            // Update the categories state with the new data
            setCategories(categories.map(cat => 
                cat.id === updatedCategory.data.id ? updatedCategory.data : cat
            ));
            
            setIsEditModalOpen(false);
            setErrors({});
        } catch (error) {
            console.error('Update error:', error);
            alert(error.message || 'Failed to update category');
        } finally {
            setIsLoading(false);
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
                            onClick={() => {
                                setIsAddFormVisible(!isAddFormVisible);
                                setErrors({});
                                if (isAddFormVisible) {
                                    setName('');
                                    setImage(null);
                                    setImagePreview(null);
                                }
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            disabled={isLoading}
                        >
                            {isAddFormVisible ? "Cancel" : "Add New Category"}
                        </button>
                    </div>
                </div>

                {/* Add Category Form */}
                {isAddFormVisible && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Category</h3>
                        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                <input
                                    type="text"
                                    placeholder="Category Name"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setErrors({...errors, name: null});
                                    }}
                                    className={`w-full border px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
                                <div className="flex items-center space-x-4">
                                    <label className={`cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition flex items-center ${errors.image ? 'border border-red-500' : ''}`}>
                                        <FaImage className="mr-2" /> Choose Image
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                    {imagePreview && (
                                        <div className="relative w-20 h-20">
                                            <img
                                                src={imagePreview}
                                                alt="Category preview"
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImage(null);
                                                    setImagePreview(null);
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                            </div>

                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span>Processing...</span>
                                ) : (
                                    <>
                                        <FaPlus className="mr-2" /> Add Category
                                    </>
                                )}
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
                                <th className="p-3 text-center">Image</th>
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
                                        <td className="p-3 text-center">
                                            {category.image ? (
                                                <img 
                                                    src={category.image} 
                                                    alt={category.name}
                                                    className="w-10 h-10 object-cover rounded-md inline-block"
                                                />
                                            ) : (
                                                <span className="text-gray-400">No image</span>
                                            )}
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
                                                disabled={isLoading}
                                            >
                                                <FaList />
                                            </button>
                                            <button 
                                                className="text-blue-600 hover:text-green-700" 
                                                title="Add Items"
                                                disabled={isLoading}
                                            >
                                                <Link href={`/admin/menu/category/${category.slug}/items`} className="text-blue-600 hover:text-green-700">
                                                    <FaPlus />
                                                </Link>
                                            </button>
                                            <button
                                                onClick={() => openEditModal(category)}
                                                className="text-blue-600 hover:text-blue-700"
                                                title="Edit Category"
                                                disabled={isLoading}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(category.id)}
                                                className="text-red-600 hover:text-red-900 font-medium"
                                                title="Delete Category"
                                                disabled={isLoading}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center text-gray-500 py-4">
                                        {isLoading ? "Loading categories..." : "No categories available."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Items Modal */}
                {isItemModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-md w-1/2 max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">
                                    Items in {categories.find(c => c.id === selectedCategory)?.name || 'Category'}
                                </h2>
                                <button
                                    onClick={() => setIsItemModalOpen(false)}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Close
                                </button>
                            </div>
                            
                            {isLoading ? (
                                <div className="text-center py-4">Loading items...</div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="p-2 text-center">Name</th>
                                            <th className="p-2 text-center">Price</th>
                                            <th className="p-2 text-center">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categoryItems.length > 0 ? categoryItems.map((item) => (
                                            <tr key={item.id} className="border-t">
                                                <td className="p-3 font-semibold text-gray-800 text-center">{item.name}</td>
                                                <td className="p-3 font-semibold text-gray-800 text-center">{item.price} DH</td>
                                                <td className="p-3 text-gray-600 text-center">{item.description || 'No description'}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="3" className="text-center p-4 text-gray-500">
                                                    No items in this category
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold mb-4">
                                Are you sure you want to delete this category?
                            </h2>
                            <p className="text-gray-600 mb-4">
                                This action cannot be undone. All items in this category will also be affected.
                            </p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-md w-96">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Category</h3>
                            
                            <form className="space-y-4" encType="multipart/form-data">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                    <input
                                        type="text"
                                        value={categoryToEdit?.name || ""}
                                        onChange={(e) => {
                                            setCategoryToEdit({ ...categoryToEdit, name: e.target.value });
                                            setErrors({...errors, editName: null});
                                        }}
                                        className={`w-full border px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.editName ? 'border-red-500' : ''}`}
                                    />
                                    {errors.editName && <p className="text-red-500 text-sm mt-1">{errors.editName}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
                                    <div className="flex items-center space-x-4">
                                        <label className={`cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition flex items-center ${errors.editImage ? 'border border-red-500' : ''}`}>
                                            <FaImage className="mr-2" /> Choose Image
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleEditImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                        {editImagePreview && (
                                            <div className="relative w-16 h-16">
                                                <img
                                                    src={editImagePreview}
                                                    alt="Category preview"
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCategoryToEdit({
                                                            ...categoryToEdit,
                                                            image: null
                                                        });
                                                        setEditImagePreview(null);
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {errors.editImage && <p className="text-red-500 text-sm mt-1">{errors.editImage}</p>}
                                </div>
                            </form>
                            
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        setErrors({});
                                    }}
                                    className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEdit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Saving..." : "Save"}
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