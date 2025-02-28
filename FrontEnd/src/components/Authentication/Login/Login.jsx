import { useState } from "react";
import "./Login.css"; // Importing external CSS

const Login = () => {
  const [formData, setFormData] = useState({
    email: "", // Default email as shown in the image
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="login-container">
      <form className="login-form">
        {/* Email Input */}
        <label>Email <span>*</span></label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled // Email input is disabled as per the image
        />

        {/* Password Input */}
        <label>Password <span>*</span></label>
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Login Button */}
        <button type="submit" className="login-btn">Login</button>

        {/* Guest User Button */}
        <button type="button" className="guest-btn">Get Guest User Credentials</button>
      </form>
    </div>
  );
};

export default Login;
