
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/");
  }

  const closeMenu = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link className="brand" to="/" onClick={closeMenu}>
          Career<span>Connect</span>
        </Link>

        <button className="menu-toggle" onClick={() => setOpen(!open)}
          aria-label="Toggle navigation" aria-expanded={open}>
          ☰
        </button>

        <nav className={open ? "nav-links open" : "nav-links"}>
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/jobs" onClick={closeMenu}>Find Jobs</NavLink>

          {user ? (
            <>
              <NavLink to="/dashboard" onClick={closeMenu}>Dashboard</NavLink>
              <NavLink to="/applications" onClick={closeMenu}>Applications</NavLink>
              <NavLink to="/profile" onClick={closeMenu}>Profile</NavLink>
              <button className="btn btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMenu}>Login</NavLink>
              <Link className="btn btn-primary" to="/register" onClick={closeMenu}>
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
