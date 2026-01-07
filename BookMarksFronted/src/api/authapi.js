import api from "./axiosInstance";

export const loginUser = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const registerUser = async (email, password) => {
  const res = await api.post("/auth/register", { email, password });
  return res.data;
};
