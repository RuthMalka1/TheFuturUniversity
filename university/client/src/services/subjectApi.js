import axios from "axios";
import { API_BASE_URL } from "./apiBase";

export const addSubject = async (body) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/subject`, body);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const updateSubject = async (id, body) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/subject/${id}`, body);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const getAllSubjects = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/subject`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const getSubjectById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/subject/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const deleteSubject = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/subject/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};
