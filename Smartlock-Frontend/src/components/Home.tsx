import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import "../styles/Homepage.css";
import NavigationBar from "./NavigationBar";

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

  return (
    <div className="home-container">
      <NavigationBar message={message} />
      <h1>Welcome to the Home Page!</h1>
    </div>
  );
};

export default Home;
