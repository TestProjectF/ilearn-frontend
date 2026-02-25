import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Layout({ children }) {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <Link to="/" className="text-xl font-bold text-blue-700">
                    iLearn+
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600 text-sm hidden sm:block">
                        {user?.name}
                    </span>
                    <button
                        onClick={logout}
                        className="text-sm text-red-500 hover:underline"
                    >
                        Đăng xuất
                    </button>
                </div>
            </nav>

            {/* Main content */}
            <main className="max-w-5xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}