import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfileApi, getProfileApi } from '../api/authApi';
import { getAllProgressApi } from '../api/progressApi';
import { useEffect } from 'react';

export default function ProfilePage() {
    const { user, login } = useAuth();
    const [form, setForm] = useState({
        name: user?.name || '',
        avatar_url: user?.avatar_url || ''
    });
    const [allProgress, setAllProgress] = useState([]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getAllProgressApi()
            .then(res => setAllProgress(res.data.progress))
            .catch(() => { });
    }, []);

    const totalCompleted = allProgress.reduce((sum, p) => sum + p.completed, 0);
    const totalLessons = allProgress.reduce((sum, p) => sum + p.total, 0);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            await updateProfileApi(form);

            // Lấy lại profile mới nhất rồi cập nhật context
            const res = await getProfileApi();
            const token = localStorage.getItem('token');
            login(token, res.data.user);

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError('Cập nhật thất bại, thử lại sau.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Hồ sơ cá nhân</h2>

            {/* Avatar + tên */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {user?.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                alt="avatar"
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        ) : (
                            <span className="text-3xl font-bold text-blue-600">
                                {user?.name?.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{user?.name}</h3>
                        <p className="text-gray-500 text-sm">{user?.email}</p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded mt-1 inline-block ${user?.role === 'admin'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-blue-100 text-blue-600'
                            }`}>
                            {user?.role === 'admin' ? 'Admin' : 'Sinh viên'}
                        </span>
                    </div>
                </div>

                {/* Thống kê học tập */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-blue-600">
                            {allProgress.length}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Khóa học</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {totalCompleted}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Bài đã học</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-purple-600">
                            {totalLessons === 0
                                ? 0
                                : Math.round((totalCompleted / totalLessons) * 100)}%
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Hoàn thành</p>
                    </div>
                </div>

                {/* Form chỉnh sửa */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Họ tên
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Avatar URL
                        </label>
                        <input
                            type="text"
                            name="avatar_url"
                            value={form.avatar_url}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={user?.email}
                            disabled
                            className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-400 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400 mt-1">Email không thể thay đổi</p>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                        {saving ? 'Đang lưu...' : saved ? '✅ Đã lưu!' : 'Lưu thay đổi'}
                    </button>
                </div>
            </div>

            {/* Tiến độ từng course */}
            {allProgress.length > 0 && (
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="font-semibold text-gray-700 mb-4">
                        Tiến độ học tập
                    </h3>
                    <div className="space-y-4">
                        {allProgress.map(p => (
                            <div key={p.courseId}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-700">{p.title}</span>
                                    <span className="text-sm font-medium text-blue-600">
                                        {p.percentage}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all ${p.percentage === 100 ? 'bg-green-500' : 'bg-blue-500'
                                            }`}
                                        style={{ width: `${p.percentage}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {p.completed}/{p.total} bài học
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}