import { useState } from 'react';
import { chatWithAiApi } from '../../api/aiApi';

export default function AiChat({ lessonId }) {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Xin chào! Tôi là AI trợ lý của iLearn+. Bạn có câu hỏi gì về bài học này không?'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [degraded, setDegraded] = useState(false);

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        // Thêm message của user vào UI ngay
        const userMessage = { role: 'user', content: trimmed };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const res = await chatWithAiApi(lessonId, trimmed);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: res.data.reply }
            ]);
            if (res.data.degraded) setDegraded(true);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Có lỗi xảy ra. Vui lòng thử lại sau.'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="bg-white rounded-xl shadow mt-8">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="font-medium text-gray-700 text-sm">AI Learning Assistant</span>
                {degraded && (
                    <span className="ml-auto text-xs text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded">
                        Degraded mode
                    </span>
                )}
            </div>

            {/* Messages */}
            <div className="h-72 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-sm'
                                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                                }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-2xl rounded-bl-sm text-sm">
                            Đang suy nghĩ...
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="flex gap-2 p-4 border-t">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Hỏi gì đó về bài học này..."
                    className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                />
                <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                >
                    Gửi
                </button>
            </div>
        </div>
    );
}