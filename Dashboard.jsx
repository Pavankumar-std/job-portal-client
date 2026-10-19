
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function Dashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/applications/my")
      .then((res) => {
        const data = res.data.applications ||
          res.data.data?.applications || res.data.data || res.data;
        setApplications(Array.isArray(data) ? data : []);
      })
      .catch(() => setError("Unable to load application statistics."))
      .finally(() => setLoading(false));
  }, []);

  const count = (wanted) => applications.filter((app) => {
    const status = String(app.status || "Applied").toLowerCase();
    return wanted.includes(status);
  }).length;

  const stats = [
    { label: "Total Applications", value: applications.length, icon: "▤" },
    { label: "Pending", value: count(["pending", "applied"]), icon: "◷" },
    { label: "Shortlisted", value: count(["shortlisted"]), icon: "☆" },
    { label: "Selected", value: count(["selected", "accepted"]), icon: "✓" },
    { label: "Rejected", value: count(["rejected"]), icon: "↗" },
  ];

  return (
    <section className="container page-section">
      <div className="dashboard-welcome">
        <div>
          <span className="eyebrow">CANDIDATE DASHBOARD</span>
          <h1>Welcome, {user?.name || user?.fullName || "Candidate"}!</h1>
          <p>Here is an overview of your career progress.</p>
        </div>
        <Link to="/jobs" className="btn btn-primary">Find New Jobs →</Link>
      </div>

      {loading && <Loader text="Loading dashboard..." />}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <>
          <div className="stats-grid">
            {stats.map((stat) => (
              <article className="stat-card card" key={stat.label}>
                <span className="stat-icon">{stat.icon}</span>
                <p>{stat.label}</p>
                <strong>{stat.value}</strong>
              </article>
            ))}
          </div>

          <div className="section-heading dashboard-table-heading">
            <div><h2>Recent applications</h2><p>Keep track of your submitted applications.</p></div>
            <Link className="text-link" to="/applications">View all →</Link>
          </div>

          {applications.length === 0 ? (
            <div className="empty-state">
              <h3>Your next opportunity starts here</h3>
              <p>You have not applied for any jobs yet.</p>
              <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
            </div>
          ) : (
            <div className="table-wrap card">
              <table>
                <thead><tr><th>Job</th><th>Company</th><th>Applied</th><th>Status</th></tr></thead>
                <tbody>
                  {applications.slice(0, 5).map((app) => {
                    const job = app.job || app.jobId || {};
                    const title = typeof job === "object" ? job.title : app.jobTitle;
                    const company = typeof job === "object" ? (job.company || job.companyName) : app.company;
                    const status = app.status || "Applied";
                    return (
                      <tr key={app._id || app.id}>
                        <td>{title || "Job"}</td>
                        <td>{company || "—"}</td>
                        <td>{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "—"}</td>
                        <td><span className={`status status-${String(status).toLowerCase().replace(/\s+/g, "-")}`}>{status}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}
