import axios from "axios";
import { API_BASE_URL } from "./apiBase";

export const addMaterial = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/materials`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const updateMaterial = async (id, body) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/materials/${id}`, body);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const getAllMaterials = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/materials`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const getMaterialById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/materials/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const deleteMaterial = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/materials/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};
