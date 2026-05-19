import axios from "axios";
import { API_BASE_URL } from "./apiBase";

export const addRespons = async (body) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/respons`, body);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const updateRespons = async (id, body) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/respons/${id}`, body);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const getAllResponses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/respons`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const getResponsById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/respons/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const deleteRespons = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/respons/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const clearConversationResponses = async (body) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/respons/clear`, body);
    return response.data;
  } catch (error) {
    return error.message;
  }
};
