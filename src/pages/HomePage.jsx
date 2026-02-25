import { useAuth } from '../context/AuthContext';

export default function HomePage() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-700">iLearn+</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600 text-sm">Xin chào, {user?.name}</span>
                    <button
                        onClick={logout}
                        className="text-sm text-red-500 hover:underline"
                    >
                        Đăng xuất
                    </button>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Khóa học của bạn
                </h2>
                <p className="text-gray-500">Đang tải...</p>
            </main>
        </div>
    );
}