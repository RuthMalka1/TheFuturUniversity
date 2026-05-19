import axios from "axios";
import { API_BASE_URL } from "./apiBase";

export const addStudentTask = async (body) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/studentTask`, body);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const updateStudentTask = async (id, body) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/studentTask/${id}`, body);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const getAllStudentTasks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/studentTask`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const getStudentTaskById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/studentTask/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const deleteStudentTask = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/studentTask/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};
