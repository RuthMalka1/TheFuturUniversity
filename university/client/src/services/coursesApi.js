import axios from "axios";
import { API_BASE_URL } from "./apiBase";

// CREATE
export const addCourse = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/courses`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  } catch (error) {
    return error.message;
  }
};

// GET
export const getAllCourses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const getCourseById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

// UPDATE
export const updateCourse = async (id, body) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/courses/${id}`, body);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

// DELETE
export const deleteCourse = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/courses/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};