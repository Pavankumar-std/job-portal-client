
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import JobCard from "../components/JobCard";
import Loader from "../components/Loader";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/jobs")
      .then((res) => {
        const data = res.data.jobs || res.data.data?.jobs || res.data.data || res.data;
        setJobs(Array.isArray(data) ? data.slice(0, 3) : []);
      })
      .catch(() => setError("Unable to load featured jobs. Please try again later."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
            <h1>Find work that moves <span>you forward.</span></h1>
            <p>
              Explore internships and jobs, build your experience, and take
              the next step in your career.
            </p>
            <div className="hero-actions">
              <Link to="/jobs" className="btn btn-primary">Explore Opportunities →</Link>
              <Link to="/register" className="btn btn-outline">Create Account</Link>
            </div>
            <div className="hero-note">Opportunities for freshers, students and professionals.</div>
          </div>
          <div className="hero-art" aria-label="Career growth illustration">
            <div className="art-circle">
              <span className="art-star">✦</span>
              <div className="art-card">
                <span className="art-icon">↗</span>
                <h3>Your future is waiting.</h3>
                <p>Discover. Apply. Grow.</p>
              </div>
              <div className="art-bubble bubble-one">✓ New opportunities</div>
              <div className="art-bubble bubble-two">✦ Career growth</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">START EXPLORING</span>
            <h2>Featured opportunities</h2>
            <p>Find a role that matches your interests and skills.</p>
          </div>
          <Link to="/jobs" className="text-link">View all jobs →</Link>
        </div>

        {loading && <Loader text="Loading featured jobs..." />}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && jobs.length === 0 && (
          <div className="empty-state">
            <h3>New opportunities are on the way</h3>
            <p>No jobs are available right now. Please check back soon.</p>
            <Link className="btn btn-primary" to="/jobs">Browse jobs</Link>
          </div>
        )}
        {!loading && jobs.length > 0 && (
          <div className="job-grid">
            {jobs.map((job) => <JobCard key={job._id || job.id} job={job} />)}
          </div>
        )}
      </section>

      <section className="steps-section">
        <div className="container">
          <div className="section-heading centered">
            <div>
              <span className="eyebrow">A SIMPLE PROCESS</span>
              <h2>Your career journey in 3 steps</h2>
            </div>
          </div>
          <div className="steps-grid">
            <article className="step-card"><span>01</span><h3>Explore</h3><p>Search opportunities that match your goals.</p></article>
            <article className="step-card"><span>02</span><h3>Apply</h3><p>Submit your application and introduce yourself.</p></article>
            <article className="step-card"><span>03</span><h3>Grow</h3><p>Track your applications and move forward.</p></article>
          </div>
        </div>
      </section>
    </>
  );
}
