import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Layout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <Link to="/" className="text-xl font-bold text-blue-700">
                    iLearn+
                </Link>

                <div className="flex items-center gap-4">
                    {/* Link Profile */}
                    <Link
                        to="/profile"
                        className="flex items-center gap-2 hover:opacity-80 transition"
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                            {user?.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            ) : (
                                <span className="text-sm font-bold text-blue-600">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <span className="text-gray-600 text-sm hidden sm:block">
                            {user?.name}
                        </span>
                    </Link>

                    {/* Admin link */}
                    {user?.role === 'admin' && (
                        <Link
                            to="/admin"
                            className="text-sm text-red-500 font-medium hover:underline"
                        >
                            Admin
                        </Link>
                    )}

                    <button
                        onClick={handleLogout}
                        className="text-sm text-gray-400 hover:text-red-500 transition"
                    >
                        Đăng xuất
                    </button>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}