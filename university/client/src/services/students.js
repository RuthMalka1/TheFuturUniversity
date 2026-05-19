import axios from "axios";
import { API_BASE_URL } from "./apiBase";

export const addstudent = async (formData) => {
    try{
      const students= axios.post(`${API_BASE_URL}/courses`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    console.log("Add course succesfully!")
    }catch(error){
return error.message;
    }  

}