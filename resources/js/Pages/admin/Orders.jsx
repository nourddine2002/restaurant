import AdminLayout from '../../Layouts/AdminLayout';

const Orders = () => {
    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>
                <p>Here you can manage restaurant orders.</p>
            </div>
            <div>
            <a href="/admin"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                    ← Back to Dashboard
                </a>
            </div>

        </AdminLayout>
    );
};

export default Orders;
