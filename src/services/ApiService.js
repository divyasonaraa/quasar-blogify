import axios from "axios";
import { Notify } from "quasar";

const BASE_URL = process.env.API;

const instance = axios.create({
  baseURL: BASE_URL,
});

const showErrorNotification = (message) => {
  Notify.create({
    color: "negative",
    position: "bottom",
    message: message,
  });
};

export const getBlogs = async () => {
  try {
    const response = await instance.get("/blogs");
    return response.data;
  } catch (error) {
    showErrorNotification("Error fetching blogs");
    throw new Error("Error fetching blogs");
  }
};

export const getBlog = async (id) => {
  try {
    const response = await instance.get(`/${id}`);
    return response.data;
  } catch (error) {
    showErrorNotification("Error fetching blog");
    throw new Error("Error fetching blog");
  }
};

export const createBlog = async (newBlog) => {
  try {
    const response = await instance.post("/blog", newBlog);
    return response.data;
  } catch (error) {
    return new Error(error);
  }
};

export const updateBlog = async (updatedBlog) => {
  try {
    const response = await instance.put(`/blog/${updatedBlog.id}`, updatedBlog);
    return response.data;
  } catch (error) {
    showErrorNotification("Error updating blog");
    throw new Error("Error updating blog");
  }
};

export const deleteBlog = async (id) => {
  try {
    await instance.delete(`/blog/${id}`);
  } catch (error) {
    console.error(error);
    showErrorNotification("Error deleting blog");
    throw new Error("Error deleting blog");
  }
};
