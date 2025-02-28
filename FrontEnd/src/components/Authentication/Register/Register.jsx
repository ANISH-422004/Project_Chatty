import { useState } from "react";
import "./Register.css"; // Importing the external CSS file

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  return (
    <div className="register-container">
      <form className="register-form">
        <h2>Register</h2>

        {/* Name Input */}
        <label>Name <span>*</span></label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter Your Name"
          required
        />

        {/* Email Input */}
        <label>Email Address <span>*</span></label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter Your Email Address"
          required
        />

        {/* Password Input */}
        <label>Password <span>*</span></label>
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
        <label>Confirm Password <span>*</span></label>
        <div className="input-group">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
          />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* File Upload Input */}
        <label>Upload your Picture</label>
        <input
          type="file"
          name="pic"
          accept="image/*"
          onChange={handleChange}
        />

        {/* Sign Up Button */}
        <button type="submit" className="register-btn">Sign Up</button>
      </form>
    </div>
  );
};

export default Register;
