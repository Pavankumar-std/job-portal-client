
import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/applications/my");
      const data = res.data.applications ||
        res.data.data?.applications || res.data.data || res.data;
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load your applications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadApplications(); }, [loadApplications]);

  function jobInfo(app) {
    const job = app.job || app.jobId || {};
    return {
      title: typeof job === "object" ? job.title : app.jobTitle || "Job",
      company: typeof job === "object" ? (job.company || job.companyName) : app.company || "—",
    };
  }

  return (
    <section className="container page-section">
      <div className="page-heading">
        <span className="eyebrow">YOUR CAREER JOURNEY</span>
        <h1>My Applications</h1>
        <p>Review the opportunities you have applied for.</p>
      </div>

      {loading && <Loader text="Loading your applications..." />}
      {error && <div className="empty-state"><p className="error-message">{error}</p><button className="btn btn-primary" onClick={loadApplications}>Try again</button></div>}

      {!loading && !error && applications.length === 0 && (
        <div className="empty-state">
          <h3>No applications yet</h3>
          <p>Find a suitable role and submit your first application.</p>
          <a className="btn btn-primary" href="/jobs">Explore Jobs</a>
        </div>
      )}

      {!loading && !error && applications.length > 0 && (
        <div className="table-wrap card">
          <table>
            <thead><tr><th>Job</th><th>Company</th><th>Applied</th><th>Status</th></tr></thead>
            <tbody>
              {applications.map((app) => {
                const info = jobInfo(app);
                const status = app.status || "Applied";
                return (
                  <tr key={app._id || app.id}>
                    <td>{info.title}</td>
                    <td>{info.company}</td>
                    <td>{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "—"}</td>
                    <td><span className={`status status-${String(status).toLowerCase().replace(/\s+/g, "-")}`}>{status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
