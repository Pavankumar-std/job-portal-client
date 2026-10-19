
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { ErrorMessage } from "../components/UI";

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", coverLetter: "", resume: null,
  });

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then((res) => setJob(res.data.job || res.data.data?.job || res.data.data || res.data))
      .catch(() => setError("Unable to load this job. It may have been removed."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user) {
      setForm((previous) => ({
        ...previous,
        name: previous.name || user.name || "",
        email: previous.email || user.email || "",
      }));
    }
  }, [user]);

  function update(event) {
    const { name, value, files } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: files ? files[0] : value,
    }));
  }

  async function apply(event) {
    event.preventDefault();
    setMessage("");

    if (!user || !localStorage.getItem("token")) {
      setMessage("Please log in before applying.");
      return;
    }
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.coverLetter.trim()) {
      setMessage("Please complete all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setMessage("Please enter a valid email address.");
      return;
    }
    if (!/^\+?[0-9\s()-]{7,20}$/.test(form.phone)) {
      setMessage("Please enter a valid phone number.");
      return;
    }
    if (!form.resume || form.resume.type !== "application/pdf") {
      setMessage("Please upload your resume in PDF format.");
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append("name", form.name);
      data.append("email", form.email);
      data.append("phone", form.phone);
      data.append("coverLetter", form.coverLetter);
      data.append("resume", form.resume);
      data.append("job", id);

      await api.post("/applications", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Application submitted successfully!");
      setForm((previous) => ({ ...previous, coverLetter: "", resume: null }));
      event.target.reset();
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to submit your application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loader text="Loading job details..." />;
  if (error || !job) {
    return <section className="container page-section"><ErrorMessage>{error || "Job not found."}</ErrorMessage><Link to="/jobs">← Back to jobs</Link></section>;
  }

  const skills = Array.isArray(job.skills) ? job.skills : [];

  return (
    <section className="container page-section">
      <Link to="/jobs" className="text-link">← Back to opportunities</Link>

      <div className="details-layout">
        <article className="details-main card">
          <span className="tag">{job.type || job.jobType || "Opportunity"}</span>
          <h1>{job.title}</h1>
          <h3 className="company-name">{job.company || job.companyName || "Company"}</h3>
          <div className="job-meta">
            <span>⌖ {job.location || "Not specified"}</span>
            <span>◷ {job.experience || "Entry level"}</span>
          </div>

          <hr className="soft-rule" />
          <h2>About this role</h2>
          <p className="long-description">{job.description || "No description provided."}</p>

          <h2>Required skills</h2>
          <div className="skill-list">
            {skills.length ? skills.map((skill, i) => <span className="skill-tag" key={i}>{skill}</span>) : <p>See the job description for requirements.</p>}
          </div>

          <div className="details-facts">
            <div><span>Salary / stipend</span><strong>{job.salary || job.stipend || "Not specified"}</strong></div>
            <div><span>Application deadline</span><strong>{job.deadline ? new Date(job.deadline).toLocaleDateString() : "Not specified"}</strong></div>
          </div>
        </article>

        <aside className="apply-card card" id="apply">
          <h2>Apply for this role</h2>
          <p>Share your details and introduce yourself to the employer.</p>

          {!user && <p className="notice">Please <Link to="/login">log in</Link> before applying.</p>}
          <form onSubmit={apply} className="form-stack">
            <div className="form-group">
              <label htmlFor="name">Full name *</label>
              <input id="name" name="name" value={form.name} onChange={update} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input id="email" name="email" type="email" value={form.email} onChange={update} required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
              <input id="phone" name="phone" type="tel" value={form.phone} onChange={update} required />
            </div>
            <div className="form-group">
              <label htmlFor="resume">Resume (PDF only) *</label>
              <input id="resume" name="resume" type="file" accept=".pdf,application/pdf" onChange={update} required />
            </div>
            <div className="form-group">
              <label htmlFor="coverLetter">Cover letter *</label>
              <textarea id="coverLetter" name="coverLetter" rows="5" value={form.coverLetter} onChange={update} required />
            </div>
            {message && <p className={message.includes("successfully") ? "success-message" : "error-message"} role="status">{message}</p>}
            <button className="btn btn-primary btn-full" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
          <p className="small-note">Your application is submitted to the connected backend.</p>
        </aside>
      </div>
    </section>
  );
}
