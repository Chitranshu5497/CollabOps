import api from "../api/axios";

export const globalSearch = async (query: string) => {
  const response = await api.get("/search", {
    params: {
      q: query,
    },
  });

  return response.data.data;
};