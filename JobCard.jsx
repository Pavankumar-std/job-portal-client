
import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  const id = job._id || job.id;
  const skills = Array.isArray(job.skills) ? job.skills : [];

  return (
    <article className="job-card">
      <div className="job-card-top">
        <div className="company-icon">
          {(job.company || "C").charAt(0).toUpperCase()}
        </div>
        <span className="tag">{job.type || job.jobType || "Opportunity"}</span>
      </div>

      <h3>{job.title || "Untitled position"}</h3>
      <p className="company-name">{job.company || job.companyName || "Company"}</p>

      <div className="job-meta">
        <span>⌖ {job.location || "Location not specified"}</span>
        <span>◷ {job.experience || "Entry level"}</span>
      </div>

      {job.description && <p className="job-description">{job.description}</p>}

      <div className="skill-list">
        {skills.slice(0, 4).map((skill, index) => (
          <span className="skill-tag" key={`${skill}-${index}`}>{skill}</span>
        ))}
      </div>

      <div className="job-card-bottom">
        <span className="salary">{job.salary || job.stipend || "Compensation varies"}</span>
        {id ? (
          <Link className="btn btn-primary" to={`/jobs/${id}`}>View Details →</Link>
        ) : (
          <span className="muted">Details unavailable</span>
        )}
      </div>
    </article>
  );
}
