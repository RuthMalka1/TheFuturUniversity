import axios from "axios";
import { API_BASE_URL } from "./apiBase";

export const addUser = async (body) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, body);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const updateUser = async (id, body) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${id}`, body);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

/** רשימת משתמשים למסך ניהול (כולל טלפון; ללא שדות סיסמה) */
export const getManagementUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/management/list`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const loginUser = async (body) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, body);
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};

export const resetPasswordByPhone = async (body) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/reset-password`, body);
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};
