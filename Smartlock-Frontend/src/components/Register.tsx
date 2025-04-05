import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/LoginRegister.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const { firstname, lastname, email, password, confirmPassword } = formData;
    let isValid = true;

    if (!firstname.trim()) newErrors.firstname = "Firstname is required";
    if (!lastname.trim()) newErrors.lastname = "Lastname is required";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) newErrors.email = "Email is required";
    else if (!emailPattern.test(email)) newErrors.email = "Invalid email format";

    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    if (!password) newErrors.password = "Password is required";
    else if (!passwordPattern.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters long and include a mix of upper and lower case letters, numbers, and special characters.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:8081/register",
        {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true, // Send cookies with the request (if necessary)
          headers: {
            "X-Requested-With": "XMLHttpRequest", // Optional, may not be needed
          },
        }
      );

      alert("Registration Successful!");
      console.log("Response:", response.data);
      navigate("/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert("Registration failed: " + (error.response?.data?.message || "Unknown error"));
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Firstname:</label>
            <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} />
            {errors.firstname && <span className="error">{errors.firstname}</span>}
          </div>
          <div>
            <label>Lastname:</label>
            <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} />
            {errors.lastname && <span className="error">{errors.lastname}</span>}
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div>
            <label>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <div>
            <label>Confirm Password:</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
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
