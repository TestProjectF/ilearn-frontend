import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseByIdApi } from '../api/courseApi';
import { getCourseProgressApi } from '../api/progressApi';
import ProgressBar from '../components/common/ProgressBar';
import Spinner from '../components/common/Spinner';
export default function CourseDetailPage() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Gọi song song 2 API cùng lúc
        Promise.all([
            getCourseByIdApi(id),
            getCourseProgressApi(id)
        ])
            .then(([courseRes, progressRes]) => {
                setCourse(courseRes.data.course);
                setLessons(courseRes.data.lessons);
                setProgress(progressRes.data);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Spinner />
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
            {/* Back */}
            <Link
                to="/"
                className="text-sm text-blue-600 hover:underline mb-4 inline-block"
            >
                ← Quay lại
            </Link>

            {/* Header */}
            <div className="mb-6">
                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded w-fit block mb-3">
                    {course.model_type}
                </span>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {course.title}
                </h2>
                <p className="text-gray-500 mb-4">{course.description}</p>

                {/* Progress Bar */}
                {progress && (
                    <div className="bg-white rounded-xl shadow p-4">
                        <ProgressBar
                            percentage={progress.percentage}
                            completed={progress.completed}
                            total={progress.total}
                        />
                    </div>
                )}
            </div>

            {/* Lessons List */}
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Danh sách bài học
            </h3>

            {lessons.length === 0 ? (
                <p className="text-gray-400">Chưa có bài học nào.</p>
            ) : (
                <div className="space-y-3">
                    {lessons.map((lesson, index) => {
                        const isCompleted = progress?.completedLessonIds?.includes(lesson.id);
                        return (
                            <Link
                                key={lesson.id}
                                to={`/lessons/${lesson.id}`}
                                className="flex items-center gap-4 bg-white rounded-xl shadow hover:shadow-md transition p-4 block"
                            >
                                {/* Số thứ tự hoặc icon hoàn thành */}
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${isCompleted
                                        ? 'bg-green-500 text-white'
                                        : 'bg-blue-600 text-white'
                                        }`}
                                >
                                    {isCompleted ? '✓' : index + 1}
                                </div>

                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{lesson.title}</p>
                                    {isCompleted && (
                                        <p className="text-xs text-green-600 mt-0.5">Đã hoàn thành</p>
                                    )}
                                </div>

                                <span className="text-gray-300">→</span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}