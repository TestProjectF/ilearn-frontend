import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLessonByIdApi, completeLessonApi } from '../api/lessonApi';
import { useAuth } from '../context/AuthContext';
import AiChat from '../components/common/AiChat';

export default function LessonPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const [lesson, setLesson] = useState(null);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(false);

    useEffect(() => {
        getLessonByIdApi(id)
            .then((res) => {
                setLesson(res.data.lesson);
                setProgress(res.data.progress);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [id]);

    const handleComplete = async () => {
        setCompleting(true);
        try {
            const res = await completeLessonApi(id);
            setProgress(res.data.progress);
        } catch (err) {
            console.error(err);
        } finally {
            setCompleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-gray-400">Đang tải bài học...</p>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-red-500">Không tìm thấy bài học.</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl">
            <Link
                to={`/courses/${lesson.course_id}`}
                className="text-sm text-blue-600 hover:underline mb-4 inline-block"
            >
                ← Quay lại khóa học
            </Link>

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {lesson.title}
            </h2>

            {/* Slide embed nếu có */}
            {lesson.slide_url && (
                <div className="mb-6 rounded-xl overflow-hidden shadow">
                    <iframe
                        src={lesson.slide_url}
                        className="w-full h-96"
                        title="Slide bài học"
                        allowFullScreen
                    />
                </div>
            )}

            {/* Content */}
            <div className="bg-white rounded-xl shadow p-6 mb-6 prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {lesson.content}
                </p>
            </div>

            {/* Complete button */}
            {user && (
                <div className="flex items-center gap-4">
                    {progress?.completed ? (
                        <div className="flex items-center gap-2 text-green-600 font-medium">
                            <span>✅</span>
                            <span>Bạn đã hoàn thành bài học này</span>
                        </div>
                    ) : (
                        <button
                            onClick={handleComplete}
                            disabled={completing}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                        >
                            {completing ? 'Đang lưu...' : 'Đánh dấu hoàn thành ✓'}
                        </button>
                    )}
                </div>
            )}

            {/* AI Chat — gắn vào cuối mỗi bài học */}
            <AiChat lessonId={parseInt(id)} />   {/* 👈 thêm */}
        </div>
    );
}