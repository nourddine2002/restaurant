import AdminLayout from '../../Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

const Tables = () => {
    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Manage Tables</h1>
                <p>Here you can manage restaurant seating.</p>
            </div>
            <div className="mt-4">
                <Link href="/admin" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    ← Back to Dashboard
                </Link>
            </div>
        </AdminLayout>
    );
};

export default Tables;
