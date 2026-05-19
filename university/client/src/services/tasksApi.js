import axios from "axios";
import { API_BASE_URL } from "./apiBase";

export const addTask = async (body) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/task`, body);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const updateTask = async (id, body) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/task/${id}`, body);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const getAllTasks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/task`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const getTaskById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/task/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/task/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};
