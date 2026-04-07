import { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/users/login", { email, password });
      localStorage.setItem("user", JSON.stringify(data));
      window.dispatchEvent(new Event("auth"));
      navigate("/");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Login</h1>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-blue-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-blue-500"
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer">
          Login
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-4 text-center">
        No account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
