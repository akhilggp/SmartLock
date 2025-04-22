import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/LoginRegister.css";
import getCsrfToken from "./CSRFTokenRetrieval";

const API_BASE_URL = "http://localhost:8081"; // Base API URL

const Register = () => {
  // useNavigate Acts along with Routes in React to navigate from one page to another. Ex: Redirect to login page after Registration.
  // similar to <Link> or <NavLink> in react but is used inside a function.
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Live validation
    validateField(e.target.name, e.target.value);
  };
  // validates the fields based on the requirement for each of the input field. This is for live validation.
  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "firstname" || name === "lastname") {
      if (!value.trim()) {
        error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
      }
    } else if (name === "email") {
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
    } else if (name === "confirmPassword") {
      if (value !== formData.password) {
        error = "Passwords do not match";
      }
    }
    // The state of errors is updated here if there are any errors.
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    // Validate required fields
    // basically it takes each key value and sees if that is null or not. If not then it prints in the error as key is required.
    // key.charAt(0).toUpperCase() + key.slice(1)(Eg: username -> Username) (U + sername )
    Object.keys(formData).forEach((key) => {
      if (!formData[key as keyof typeof formData]) {
        isValid = false;
        newErrors[key as keyof typeof newErrors] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
      }
    });

    // Specific validation logic
    if (formData.password !== formData.confirmPassword) {
      isValid = false;
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return isValid;
  };
  // e.preventDefault prevents or stops the default behaviour of the Event. Like stopping from redirecting to a different link etc.
  // In here we are stopping the default event of form submission.
  // As 1. We need to do some checks before submitting the form and 2. We need to fetch the response from the backend,
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

      // Step 2: Send Register Request
      const response = await axios.post(
        `${API_BASE_URL}/register`,
        {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
          headers: { "X-XSRF-TOKEN": csrfToken },
        }
      );

      if (response.status === 201) {
        // Step 3: Navigate to Login Page
        alert("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      alert(
        "Registration failed: " +
          (error.response?.data?.message || "Unknown error")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // onSubmit: tells what to do when form is submitted. Like Form Submission when the submit button is clicked.
  // Here its calling handleSubmit. Where certain checks are done and the form data is sent to backend Java to store the values in MongoDb.
  // onChange: Returns event to the method that is mentioned when ever there is a change in the Text field. or any other interactive fields.
  // Here its calling handleChange method where the changes are handled. like Live validation is done baed on the values that are entered. So this acts immediately instead of after the submission is done.
  //
  return (
    <div className="container">
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Firstname:</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="Enter your Firstname"
            />
            {errors.firstname && (
              <span className="error">{errors.firstname}</span>
            )}
          </div>

          <div>
            <label>Lastname:</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Enter your Lastname"
            />
            {errors.lastname && (
              <span className="error">{errors.lastname}</span>
            )}
          </div>

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

          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your Password"
            />
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
          </div>

          <div className="form-anchor">
            <Link to="/login">Already a User?</Link>
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
