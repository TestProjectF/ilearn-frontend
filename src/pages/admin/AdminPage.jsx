import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllCoursesApi } from '../../api/courseApi';
import api from '../../api/axios';

export default function AdminPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [activeTab, setActiveTab] = useState('courses');
    const [loading, setLoading] = useState(true);

    // Course form
    const [courseForm, setCourseForm] = useState({
        title: '', description: '', model_type: 'iterative_incremental'
    });

    // Lesson form
    const [lessonForm, setLessonForm] = useState({
        course_id: '', title: '', content: '', slide_url: '', order_index: 1
    });

    const [message, setMessage] = useState('');

    useEffect(() => {
        // Chặn không phải admin
        if (user?.role !== 'admin') {
            navigate('/');
            return;
        }
        loadCourses();
    }, [user]);

    const loadCourses = () => {
        getAllCoursesApi()
            .then(res => setCourses(res.data.courses))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000);
    };

    // ─── COURSE HANDLERS ───
    const handleCreateCourse = async () => {
        if (!courseForm.title) return;
        try {
            await api.post('/courses', courseForm);
            showMessage('✅ Tạo khóa học thành công');
            setCourseForm({ title: '', description: '', model_type: 'iterative_incremental' });
            loadCourses();
        } catch {
            showMessage('❌ Tạo thất bại');
        }
    };

    const handleDeleteCourse = async (id) => {
        if (!window.confirm('Xóa khóa học này? Tất cả bài học sẽ bị xóa theo.')) return;
        try {
            await api.delete(`/courses/${id}`);
            showMessage('✅ Đã xóa khóa học');
            loadCourses();
        } catch {
            showMessage('❌ Xóa thất bại');
        }
    };

    // ─── LESSON HANDLERS ───
    const handleCreateLesson = async () => {
        if (!lessonForm.course_id || !lessonForm.title) return;
        try {
            await api.post('/lessons', {
                ...lessonForm,
                course_id: parseInt(lessonForm.course_id),
                order_index: parseInt(lessonForm.order_index)
            });
            showMessage('✅ Tạo bài học thành công');
            setLessonForm({
                course_id: '', title: '', content: '', slide_url: '', order_index: 1
            });
        } catch {
            showMessage('❌ Tạo bài học thất bại');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-gray-400">Đang tải...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
                <span className="bg-red-100 text-red-600 text-sm font-medium px-3 py-1 rounded-full">
                    {user?.name} — Admin
                </span>
            </div>

            {/* Message */}
            {message && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4 text-sm">
                    {message}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {['courses', 'lessons'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition ${activeTab === tab
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
                            }`}
                    >
                        {tab === 'courses' ? '📚 Khóa học' : '📝 Bài học'}
                    </button>
                ))}
            </div>

            {/* ─── TAB: COURSES ─── */}
            {activeTab === 'courses' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Form tạo course */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="font-semibold text-gray-700 mb-4">
                            Tạo khóa học mới
                        </h3>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Tiêu đề khóa học *"
                                value={courseForm.title}
                                onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <textarea
                                placeholder="Mô tả (tuỳ chọn)"
                                value={courseForm.description}
                                onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                                rows={3}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                            <select
                                value={courseForm.model_type}
                                onChange={e => setCourseForm({ ...courseForm, model_type: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="iterative_incremental">Iterative Incremental</option>
                                <option value="waterfall">Waterfall</option>
                                <option value="agile">Agile / Scrum</option>
                                <option value="spiral">Spiral</option>
                            </select>
                            <button
                                onClick={handleCreateCourse}
                                disabled={!courseForm.title}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition text-sm"
                            >
                                Tạo khóa học
                            </button>
                        </div>
                    </div>

                    {/* Danh sách courses */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="font-semibold text-gray-700 mb-4">
                            Danh sách khóa học ({courses.length})
                        </h3>
                        {courses.length === 0 ? (
                            <p className="text-gray-400 text-sm">Chưa có khóa học nào.</p>
                        ) : (
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                {courses.map(course => (
                                    <div
                                        key={course.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex-1 min-w-0 mr-3">
                                            <p className="font-medium text-gray-800 text-sm truncate">
                                                {course.title}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {course.lesson_count} bài · {course.model_type}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteCourse(course.id)}
                                            className="text-red-500 hover:text-red-700 text-xs flex-shrink-0 font-medium"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ─── TAB: LESSONS ─── */}
            {activeTab === 'lessons' && (
                <div className="bg-white rounded-xl shadow p-6 max-w-2xl">
                    <h3 className="font-semibold text-gray-700 mb-4">Tạo bài học mới</h3>
                    <div className="space-y-3">
                        <select
                            value={lessonForm.course_id}
                            onChange={e => setLessonForm({ ...lessonForm, course_id: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Chọn khóa học *</option>
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Tiêu đề bài học *"
                            value={lessonForm.title}
                            onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <textarea
                            placeholder="Nội dung bài học"
                            value={lessonForm.content}
                            onChange={e => setLessonForm({ ...lessonForm, content: e.target.value })}
                            rows={5}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />

                        <input
                            type="text"
                            placeholder="Slide URL (Google Slides embed, tuỳ chọn)"
                            value={lessonForm.slide_url}
                            onChange={e => setLessonForm({ ...lessonForm, slide_url: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="flex items-center gap-3">
                            <label className="text-sm text-gray-600 flex-shrink-0">
                                Thứ tự:
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={lessonForm.order_index}
                                onChange={e => setLessonForm({ ...lessonForm, order_index: e.target.value })}
                                className="w-24 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            onClick={handleCreateLesson}
                            disabled={!lessonForm.course_id || !lessonForm.title}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition text-sm"
                        >
                            Tạo bài học
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}