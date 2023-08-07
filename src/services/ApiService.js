import axios from "axios";

const BASE_URL = "http://localhost:3000/blogs";

export const getBlogs = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching blogs");
  }
};

export const createBlog = async (newBlog) => {

  console.log("newBlog", newBlog);
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
