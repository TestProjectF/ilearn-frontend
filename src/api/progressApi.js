import api from './axios';

export const getCourseProgressApi = (courseId) =>
    api.get(`/progress/${courseId}`);

export const getAllProgressApi = () =>
    api.get('/progress');