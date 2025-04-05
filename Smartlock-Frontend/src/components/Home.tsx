import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import getCsrfToken from "./CSRFTokenRetrieval";

const API_BASE_URL = "http://localhost:8081";

const Home = () => {
  const [message, setMessage] = useState("Loading...");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      console.log(location.state);
      setMessage(location.state.message);
    } else {
      axios
        .get(`${API_BASE_URL}/home`, { withCredentials: true })
        .then((response) => {
          setMessage(response.data.message || "No message received"); // ✅ Extract message property
        })
        .catch((error) => {
          console.error("Error fetching home message:", error);
          navigate("/login", {
            state: { message: "Session expired. Please log in again." },
          });
        });
    }
  }, [location.state, navigate]);

  const handleLogout = async () => {
    try {
      const csrfToken = await getCsrfToken();
      if (!csrfToken) {
        console.error("Failed to get CSRF token");
        return;
      }

      const logoutResponse = await axios.post(
        `${API_BASE_URL}/logout`,
        {},
        {
          withCredentials: true,
          headers: { "X-XSRF-TOKEN": csrfToken },
        }
      );
      if (logoutResponse.status === 200) {
        console.log(logoutResponse.data.message);
        localStorage.clear();
        navigate("/login", { state: { message: "Logout successful!" } });
      }
    } catch (error: any) {
      console.error("Logout error:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      <h2>{message}</h2> {/* ✅ Now message is always a string */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
