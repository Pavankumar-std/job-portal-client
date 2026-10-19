
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-section">
      <div className="auth-card card">
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Sign in to your account</h1>
        <p>Continue your career journey with CareerConnect.</p>

        {error && <div className="error-message" role="alert">{error}</div>}

        <form className="form-stack" onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" required autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" required minLength="6"
              autoComplete="current-password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password" />
          </div>
          <button className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">Don't have an account? <Link to="/register">Create one</Link></p>
      </div>
    </section>
  );
}
