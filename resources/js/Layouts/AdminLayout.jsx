import Dropdown from '@/Components/Dropdown';

const AdminLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
                <h1 className="text-xl font-bold">Restaurant Management - Admin</h1>

                {/* Dropdown Menu for Logout */}
                <div className="relative">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded">
                                Admin Menu ⬇
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md">
                            <Dropdown.Link 
                                href={route('logout')} 
                                method="post" 
                                as="button"
                                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                            >
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </nav>

            {/* Main Content */}
            <main className="p-6 container mx-auto">{children}</main>
        </div>
    );
};

export default AdminLayout;
