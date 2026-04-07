import { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../lib/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", username: "", password: "", name: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/users/register", form);
      localStorage.setItem("user", JSON.stringify(data));
      window.dispatchEvent(new Event("auth"));
      navigate("/");
    } catch {
      setError("Email or username already taken");
    }
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Register</h1>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={form.name}
          onChange={set("name")}
          placeholder="Name"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-blue-500"
        />
        <input
          value={form.username}
          onChange={set("username")}
          placeholder="Username"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-blue-500"
        />
        <input
          type="email"
          value={form.email}
          onChange={set("email")}
          placeholder="Email"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-blue-500"
        />
        <input
          type="password"
          value={form.password}
          onChange={set("password")}
          placeholder="Password"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-blue-500"
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer">
          Register
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-4 text-center">
        Have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
