import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';
import { Link } from '@inertiajs/react';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newUser, setNewUser] = useState({
        username: '',
        password: '',
        role: 'waiter'
    });
    const [showAddForm, setShowAddForm] = useState(false);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null); // State for the user being edited
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [userIdToDelete, setUserIdToDelete] = useState(null); // ID of the user to delete


    // Fetch all users when component mounts
    useEffect(() => {
        fetchUsers();
    }, []);

    // Function to fetch all users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/users');
            // Filter to show only waiters
            const waiters = response.data.filter(user => user.role === 'waiter');
            setUsers(waiters);
            setError(null);
        } catch (err) {
            setError('Failed to fetch users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle input change for new user form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission to create a new waiter
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/users', newUser);
            // Reset form
            setNewUser({
                username: '',
                password: '',
                role: 'waiter'
            });
            setShowAddForm(false);
            // Refresh users list
            fetchUsers();
        } catch (err) {
            setError('Failed to create user: ' + (err.response?.data?.message || err.message));
            console.error(err);
        }
    };

    // Handle user deletion
    const handleDelete2 = async () => {
        if (!userIdToDelete) return;
        try {
            await axios.delete(`/api/users/${userIdToDelete}`);
            setIsModalOpen(false); // Close the modal
            fetchUsers(); // Refresh the users list
        } catch (err) {
            setError('Failed to delete user');
            console.error(err);
        }
    };

    // Handle user update
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/users/${editingUser.id}`, editingUser);
            // Reset editing state
            setEditingUser(null);
            // Refresh users list
            fetchUsers();
        } catch (err) {
            setError('Failed to update user: ' + (err.response?.data?.message || err.message));
            console.error(err);
        }
    };

    // Handle input change for update form
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <AdminLayout>
            <Head title="Users Management" />

            <div className="p-6">
                  {/* Delete Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete this user? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete2}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Waiters Management</h2>
                    <div className="flex space-x-3">
                        <Link
                            href="/admin"
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                        >
                            ← Back to Dashboard
                        </Link>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                            {showAddForm ? 'Cancel' : 'Add New Waiter'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                        <p>{error}</p>
                    </div>
                )}

                {showAddForm && (
                    <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Add New Waiter</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={newUser.username}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={newUser.password}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <input type="hidden" name="role" value="waiter" />
                            </div>
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                                >
                                    Create Waiter
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {editingUser && (
                    <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Update Waiter</h3>
                        <form onSubmit={handleUpdate}>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={editingUser.username}
                                        onChange={handleEditInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={editingUser.password}
                                        onChange={handleEditInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <input type="hidden" name="role" value="waiter" />
                            </div>
                            <div className="mt-6 flex space-x-3">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-green-700 transition"
                                >
                                    Update Waiter
                                </button>
                                <button
                                    onClick={() => setEditingUser(null)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : users.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-500">No waiters found. Create your first waiter!</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                                onClick={() => setEditingUser({ ...user })}
                                                className="text-blue-600 hover:text-blue-900 font-medium mr-3"
                                            >
                                            <FaEdit/>
                                            </button>

                                            <button
                                                onClick={() =>{
                                                    setUserIdToDelete(user.id); // Set the user ID to delete
                                                    setIsModalOpen(true); // Open the modal
                                                }}
                                                className="text-red-600 hover:text-red-900 font-medium mr-3"
                                            >
                                                <FaTrash/>
                                            </button>
                                
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}