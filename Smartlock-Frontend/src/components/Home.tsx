import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import getCsrfToken from "./CSRFTokenRetrieval";
import "../styles/Homepage.css";

const API_BASE_URL = "http://localhost:8081";

// the message sent in by the login page is taken and set here and used to display in the home page.
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
          setMessage(response.data.message || "No message received"); // Extract message property
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
  const getUsernameFromMessage = (msg: string) => {
    try {
      const parts = msg.split(",");
      if (parts.length < 2) return msg;
      const email = parts[1].trim();
      return email.split("@")[0];
    } catch (e) {
      return msg;
    }
  };

  return (
    <div className="home-container">
      <nav className="home-nav">
        <h2>{getUsernameFromMessage(message)}</h2>
        <button onClick={handleLogout}>Logout</button>
      </nav>
      <h1>Welcome to the Home Page!</h1>
    </div>
  );
};

export default Home;
