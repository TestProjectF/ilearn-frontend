import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <p className="text-7xl font-bold text-blue-200 mb-4">404</p>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Trang không tồn tại
                </h2>
                <p className="text-gray-500 mb-6">
                    Đường dẫn bạn truy cập không tồn tại.
                </p>
                <Link
                    to="/"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Về trang chủ
                </Link>
            </div>
        </div>
    );
}