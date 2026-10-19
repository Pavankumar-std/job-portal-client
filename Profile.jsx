
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      name: user?.name || user?.fullName || "",
      email: user?.email || "",
    });
  }, [user]);

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      // This endpoint must be implemented by your backend.
      await api.patch("/auth/me", { name: form.name.trim() });
      await refreshUser();
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update profile. Check whether PATCH /auth/me exists in your backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-section">
      <div className="auth-card card">
        <span className="eyebrow">YOUR ACCOUNT</span>
        <h1>My Profile</h1>
        <p>Review and update your personal details.</p>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <form className="form-stack" onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <input id="name" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" value={form.email} readOnly />
            <span className="small-note">Email changes are not enabled on this form.</span>
          </div>
          <button className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </section>
  );
}
