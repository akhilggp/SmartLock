import axios from "axios";

const getCsrfToken = async (): Promise<string | null> => {
  try {
    const response = await axios.get("http://localhost:8081/csrf-token", {
      withCredentials: true,
    });
console.log(response.data.csrfToken)
    return response.data.csrfToken;
  } catch (error) {
    console.error("Failed to get CSRF token:", error);
    return null;
  }
};

export default getCsrfToken;