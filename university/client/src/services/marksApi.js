import axios from "axios";
import { API_BASE_URL } from "./apiBase";

export const addMark = async (body) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/marks`, body);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const updateMark = async (id, body) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/marks/${id}`, body);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const getAllMarks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/marks`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const getMarkById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/marks/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const deleteMark = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/marks/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};
