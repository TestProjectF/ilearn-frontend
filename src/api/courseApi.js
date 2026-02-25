import api from './axios';

export const getAllCoursesApi = () => api.get('/courses');
export const getCourseByIdApi = (id) => api.get(`/courses/${id}`);