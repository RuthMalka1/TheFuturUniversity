import axios from "axios";
import { API_BASE_URL } from "./apiBase";

export const addLearndCourse = async (body) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/learndCourses`, body);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const updateLearndCourse = async (id, body) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/learndCourses/${id}`, body);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const getAllLearndCourses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/learndCourses`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const getLearndCourseById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/learndCourses/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const deleteLearndCourse = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/learndCourses/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};
