import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );

  useEffect(() => {
    const sync = () =>
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    window.addEventListener("auth", sync);
    return () => window.removeEventListener("auth", sync);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth"));
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">
          Blog
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link to="/new" className="hover:underline">
                Write
              </Link>
              <Link to="/my-posts" className="hover:underline">
                My Posts
              </Link>
              <button
                onClick={logout}
                className="hover:underline cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
