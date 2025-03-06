import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_HOST,
});

export default async function callServer({ path, data, method = "GET" }) {
  try {
    const response = await api({
      method,
      url: path,
      data,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return {
      error,
    };
  }
}
