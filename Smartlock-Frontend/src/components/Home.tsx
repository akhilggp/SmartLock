import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import "../styles/Homepage.css";

const API_BASE_URL = "http://localhost:8081";

const Home = () => {
  const [message, setMessage] = useState("Loading...");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 1. If redirected from Login with state message
    if (location.state?.homeMessage) {
      setMessage(location.state.homeMessage);
    }
    // 2. Otherwise, fetch protected home message
    else if (token) {
      axios
        .get(`${API_BASE_URL}/home`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setMessage(response.data.message || "No message received");
        })
        .catch((error) => {
          console.error("Error fetching home message:", error);
          localStorage.removeItem("token");
          navigate("/login", {
            state: { message: "Session expired. Please log in again." },
          });
        });
    } else {
      // No token at all
      navigate("/login", {
        state: { message: "Please login first." },
      });
    }
  }, [location.state, navigate]);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    navigate("/login", { state: { message: "Logout successful!" } });
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
