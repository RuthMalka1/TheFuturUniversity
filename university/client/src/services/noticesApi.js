import axios from "axios";
import { API_BASE_URL } from "./apiBase";

export const addNotice = async (body) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/notices`, body);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const getAllNotices = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notices`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const updateNotice = async (id, body) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/notices/${id}`, body);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const deleteNotice = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/notices/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};
