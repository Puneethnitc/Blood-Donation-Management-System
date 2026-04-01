import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_no: "",
    password: "",
    user_type: "donor",
    identifier: "",
  });

  const [message, setMessage] = useState("");

  const API = "http://localhost:3000/api/auth"; // your backend URL

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 SIGNUP
  const signup = async () => {
    try {
      const res = await axios.post(`${API}/signup`, {
        name: form.name,
        email: form.email,
        phone_no: form.phone_no,
        password: form.password,
        user_type: form.user_type,
      });

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  // 🔹 LOGIN
  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, {
        identifier: form.identifier,
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);
      setMessage("Login successful");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  // 🔹 ACCESS PROTECTED ROUTE
  const getDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(JSON.stringify(res.data));
    } catch (err) {
      setMessage(err.response?.data?.message || "Unauthorized");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔐 Auth Test</h2>

      <input name="name" placeholder="Name" onChange={handleChange} />
      <br />

      <input name="email" placeholder="Email" onChange={handleChange} />
      <br />

      <input name="phone_no" placeholder="Phone" onChange={handleChange} />
      <br />

      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <br />

      <select name="user_type" onChange={handleChange}>
        <option value="donor">Donor</option>
        <option value="hospital">Hospital</option>
        <option value="blood_bank">blood_bank</option>
      </select>

      <br /><br />

      <button onClick={signup}>Signup</button>

      <hr />

      <input
        name="identifier"
        placeholder="Email or User ID"
        onChange={handleChange}
      />
      <br />

      <button onClick={login}>Login</button>

      <hr />

      <button onClick={getDashboard}>Get Protected Data</button>

      <h3>{message}</h3>
    </div>
  );
}

export default App;