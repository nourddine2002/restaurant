import AdminLayout from '../../Layouts/AdminLayout';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: '', password: '' });

    useEffect(() => {
        axios.get('/api/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error("Error fetching users:", error));
    }, []);

    const handleAddUser = () => {
        axios.post('/api/users', newUser)
            .then(response => {
                setUsers([...users, response.data]);
                setNewUser({ name: '', email: '', role: '', password: '' });
            })
            .catch(error => console.error("Error adding user:", error));
    };

    const handleDeleteUser = (id) => {
        axios.delete(`/api/users/${id}`)
            .then(() => setUsers(users.filter(user => user.id !== id)))
            .catch(error => console.error("Error deleting user:", error));
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">User Management</h1>

                {/* Add New User Form */}
                <div className="mb-6 p-4 bg-white shadow-md rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Add New User</h2>
                    <input type="text" placeholder="Name" className="p-2 border rounded mr-2"
                        value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                    <input type="email" placeholder="Email" className="p-2 border rounded mr-2"
                        value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                    <input type="password" placeholder="Password" className="p-2 border rounded mr-2"
                        value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                    <select className="p-2 border rounded mr-2"
                        value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                        <option value="">Select Role</option>
                        <option value="Admin">Admin</option>
                        <option value="Waiter">Waiter</option>
                        <option value="Chef">Chef</option>
                    </select>
                    <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={handleAddUser}>
                        Add User
                    </button>
                </div>

                {/* User List Table */}
                <table className="w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b">
                                <td className="p-3">{user.name}</td>
                                <td className="p-3">{user.role}</td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3">
                                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        onClick={() => handleDeleteUser(user.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Back to Dashboard */}
                <div className="mt-6">
                    <a href="/admin" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        ← Back to Dashboard
                    </a>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Users;
