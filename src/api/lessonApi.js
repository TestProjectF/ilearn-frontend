import api from './axios';

export const getLessonByIdApi = (id) => api.get(`/lessons/${id}`);
export const completeLessonApi = (id) => api.post(`/lessons/${id}/complete`);