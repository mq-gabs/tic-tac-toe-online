import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
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
    alert(error.toString());
    return {
      error,
    };
  }
}
