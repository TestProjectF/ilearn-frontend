export default function ProgressBar({ percentage, completed, total }) {
    const color =
        percentage === 100
            ? 'bg-green-500'
            : percentage >= 50
                ? 'bg-blue-500'
                : 'bg-blue-300';

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                    {completed}/{total} bài hoàn thành
                </span>
                <span
                    className={`text-sm font-bold ${percentage === 100 ? 'text-green-600' : 'text-blue-600'
                        }`}
                >
                    {percentage}%
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                    className={`${color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {percentage === 100 && (
                <p className="text-green-600 text-xs mt-1 font-medium">
                    ✅ Bạn đã hoàn thành khóa học này!
                </p>
            )}
        </div>
    );
}