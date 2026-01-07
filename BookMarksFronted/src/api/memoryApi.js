import api from "./axiosInstance";

export const getAllMemories = async () => {
  try {
    const res = await api.get("/memories");
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const deleteMemory = async (id) => {
  await api.delete(`/memories/${id}`);
};


export const searchMemories = (query) =>
  api.post("/memories/search", { query });
