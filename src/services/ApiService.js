import axios from "axios";

const BASE_URL = process.env.API;

export const getBlogs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/blogs`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching blogs");
  }
};

export const getBlog = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching blogs");
  }
};

export const createBlog = async (newBlog) => {

  try {
    const response = await axios.post(BASE_URL, newBlog);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating blog");
  }
};

export const updateBlog = async (updatedBlog) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/${updatedBlog.id}`,
      updatedBlog
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error updating blog");
  }
};

export const deleteBlog = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting blog");
  }
};
