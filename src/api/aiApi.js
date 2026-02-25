import api from './axios';

export const chatWithAiApi = (lesson_id, message) =>
    api.post('/ai/chat', { lesson_id, message });