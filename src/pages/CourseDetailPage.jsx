import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseByIdApi } from '../api/courseApi';

export default function CourseDetailPage() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCourseByIdApi(id)
            .then((res) => {
                setCourse(res.data.course);
                setLessons(res.data.lessons);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-gray-400">Đang tải...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-red-500">Không tìm thấy khóa học.</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <Link
                    to="/"
                    className="text-sm text-blue-600 hover:underline mb-4 inline-block"
                >
                    ← Quay lại
                </Link>
                <span className="block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded w-fit mb-3">
                    {course.model_type}
                </span>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {course.title}
                </h2>
                <p className="text-gray-500">{course.description}</p>
            </div>

            {/* Lessons list */}
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Danh sách bài học
            </h3>

            {lessons.length === 0 ? (
                <p className="text-gray-400">Chưa có bài học nào.</p>
            ) : (
                <div className="space-y-3">
                    {lessons.map((lesson, index) => (
                        <Link
                            key={lesson.id}
                            to={`/lessons/${lesson.id}`}
                            className="flex items-center gap-4 bg-white rounded-xl shadow hover:shadow-md transition p-4 block"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {index + 1}
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">{lesson.title}</p>
                            </div>
                            <span className="ml-auto text-gray-300">→</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}