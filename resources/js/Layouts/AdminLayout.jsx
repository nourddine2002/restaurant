const AdminLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-blue-600 p-4 text-white">
                <h1 className="text-xl font-bold">Restaurant Management - Admin</h1>
            </nav>
            <main className="p-6" >{children}</main>
        </div>
    );
};

export default AdminLayout;
