import { useState } from "react";
import "./Register.css"; // Importing external CSS
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    picture: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value, // Handle file input correctly
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Create FormData for file uploads
    const formDataForPost = new FormData();
    formDataForPost.append("name", formData.name);
    formDataForPost.append("email", formData.email);
    formDataForPost.append("password", formData.password);
    if (formData.picture) {
      formDataForPost.append("picture", formData.picture);
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:3000/api/v1/user/register",
        formDataForPost,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      localStorage.setItem("c_token", res.data.token);
      alert("Profile created successfully!");
      navigate("/chats");
    } catch (err) {
      alert("Error creating profile. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form">
        {/* Name Input */}
        <label>
          Name <span>*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter Your Name"
          required
        />

        {/* Email Input */}
        <label>
          Email Address <span>*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter Your Email Address"
          required
        />

        {/* Password Input */}
        <label>
          Password <span>*</span>
        </label>
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Password"
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Confirm Password Input */}
        <label>
          Confirm Password <span>*</span>
        </label>
        <div className="input-group">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* File Upload Input */}
        <label>Upload your Picture</label>
        <input
          type="file"
          name="picture"
          accept="image/*"
          onChange={handleChange}
        />

        {/* Sign Up Button */}
        <button
          className="register-btn"
          type="button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating Profile..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Register;
