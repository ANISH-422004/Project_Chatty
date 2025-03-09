import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // Importing external CSS
import { Toaster, toaster } from "../../ui/toaster"


const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "", // Default email
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toaster.create({
        title: `Please enter your email and password.`,
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:3000/api/v1/user/login", {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("c_token", res.data.token);
      toaster.create({
        title: "Login successful!",
        type: "success",
      });
      setTimeout(() => {
        navigate("/chats");
      }, 1000);
    } catch (err) {
      toaster.create({
        title: "Email or Password is Wrong",
        type: "error",
      });
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        {/* Email Input */}
        <label>
          Email <span>*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
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
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Login Button */}
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <Toaster/>
    </div>
  );
};

export default Login;
