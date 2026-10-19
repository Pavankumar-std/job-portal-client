
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      setSuccess("Registration successful! Signing you in...");

      try {
        await login(form.email.trim(), form.password);
        navigate("/dashboard", { replace: true });
      } catch {
        setSuccess("Registration successful. Please log in to continue.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try another email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-section">
      <div className="auth-card card">
        <span className="eyebrow">GET STARTED</span>
        <h1>Create your account</h1>
        <p>Join CareerConnect and discover your next opportunity.</p>

        {error && <div className="error-message" role="alert">{error}</div>}
        {success && <div className="success-message" role="status">{success}</div>}

        <form className="form-stack" onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <input id="name" required autoComplete="name" minLength="2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name" />
          </div>
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
              autoComplete="new-password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters" />
          </div>
          <div className="form-group">
            <label htmlFor="confirm">Confirm password</label>
            <input id="confirm" type="password" required autoComplete="new-password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              placeholder="Re-enter password" />
          </div>
          <button className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
      </div>
    </section>
  );
}
