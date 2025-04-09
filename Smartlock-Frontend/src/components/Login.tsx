import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../styles/LoginRegister.css";
import getCsrfToken from "./CSRFTokenRetrieval";

const API_BASE_URL = "http://localhost:8081"; // Base API URL

// useLocation() — to get information about the current location (like the current URL, search parameters, and state).
// what is the current url. which is Login here. we can send this type of data to useNavigate and send it to another page.
// Like in logout or When login is successful we want to send some data to the home page.
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [logoutMessage, setLogoutMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect(): This is a React hook that allows you to perform side effects in function components (like fetching data, manipulating the DOM, or updating state).
  // It runs after the component renders, and in this case, it listens for changes to location.state
  // location.state will be accessible as we are using useLocation. So when the logout form sends a state in its navigate() then the state in the login form will be updated.
  // And that particular message can be used to display or use it.
  // useNavigate and useLocation as used as a combination to get a message from one page to another. just to know the state that this page acceots.
  useEffect(() => {
    if (location.state?.message) {
      setLogoutMessage(location.state.message);
    }
  }, [location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Live validation
    validateField(e.target.name, e.target.value);
  };

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        error = "Email is required";
      } else if (!emailPattern.test(value)) {
        error = "Invalid email format";
      }
    } else if (name === "password") {
      const passwordPattern =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
      if (!value) {
        error = "Password is required";
      } else if (!passwordPattern.test(value)) {
        error =
          "Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.";
      }
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = { email: "", password: "" };

    if (!formData.email) {
      isValid = false;
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      isValid = false;
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Step 1: Get CSRF token
      const csrfToken = await getCsrfToken();
      if (!csrfToken) {
        alert("Failed to get CSRF token. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Step 2: Send Login Request
      const response = await axios.post(
        `${API_BASE_URL}/login`,
        { email: formData.email, password: formData.password },
        {
          withCredentials: true,
          headers: { "X-XSRF-TOKEN": csrfToken },
        }
      );

      if (response.status === 200) {
        // Step 3: Fetch Home Page Data
        const homeResponse = await axios.get(`${API_BASE_URL}/home`, {
          withCredentials: true,
        });

        // Ensure `homeResponse.data` is a string or parse it properly
        const homeMessage =
          typeof homeResponse.data === "string"
            ? homeResponse.data
            : JSON.stringify(homeResponse.data);

        // Step 4: Navigate to Home Page with data
        navigate("/home", { state: { homeMessage } });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      alert(
        "Login failed: " + (error.response?.data?.message || "Unknown error")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="register-container">
        <h2>Login</h2>
        {logoutMessage && (
          <div className="success-message">{logoutMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your Email Id"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your Password"
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>

          <div className="form-anchor">
            <Link to="/register">New User?</Link>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
