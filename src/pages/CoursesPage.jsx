import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCoursesApi } from '../api/courseApi';

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getAllCoursesApi()
            .then((res) => setCourses(res.data.courses))
            .catch(() => setError('Không thể tải danh sách khóa học'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-gray-400">Đang tải khóa học...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Khóa học
            </h2>

            {courses.length === 0 ? (
                <p className="text-gray-400">Chưa có khóa học nào.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses.map((course) => (
                        <Link
                            key={course.id}
                            to={`/courses/${course.id}`}
                            className="bg-white rounded-xl shadow hover:shadow-md transition p-6 block"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                                    {course.model_type}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {course.lesson_count} bài học
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {course.title}
                            </h3>
                            <p className="text-gray-500 text-sm line-clamp-2">
                                {course.description}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}