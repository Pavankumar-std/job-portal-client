
import { useEffect, useState } from "react";
import api from "../services/api";
import JobCard from "../components/JobCard";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    keyword: "", location: "", type: "",
  });
  const [submitted, setSubmitted] = useState(filters);

  async function loadJobs(activeFilters = {}) {
    setLoading(true);
    setError("");

    try {
      const params = {};
      if (activeFilters.keyword) params.search = activeFilters.keyword;
      if (activeFilters.location) params.location = activeFilters.location;
      if (activeFilters.type) params.type = activeFilters.type;

      const res = await api.get("/jobs", { params });
      const data = res.data.jobs || res.data.data?.jobs || res.data.data || res.data;
      setJobs(Array.isArray(data) ? data : []);
    } catch {
      setJobs([]);
      setError("Unable to load jobs. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  function search() {
    setSubmitted({ ...filters });
    loadJobs(filters);
  }

  const visibleJobs = jobs.filter((job) => {
    const keyword = submitted.keyword.toLowerCase();
    const location = submitted.location.toLowerCase();
    const type = submitted.type.toLowerCase();

    const searchable = [
      job.title, job.company, job.companyName, job.description,
      ...(Array.isArray(job.skills) ? job.skills : []),
    ].join(" ").toLowerCase();

    return (!keyword || searchable.includes(keyword)) &&
      (!location || (job.location || "").toLowerCase().includes(location)) &&
      (!type || (job.type || job.jobType || "").toLowerCase().includes(type));
  });

  return (
    <section className="section container page-section">
      <div className="page-heading">
        <span className="eyebrow">OPPORTUNITIES FOR YOU</span>
        <h1>Find your next opportunity</h1>
        <p>Search jobs and internships that fit your career goals.</p>
      </div>

      <SearchBar filters={filters} setFilters={setFilters} onSearch={search} />

      {!loading && !error && (
        <p className="results-count">{visibleJobs.length} opportunities found</p>
      )}

      {loading && <Loader text="Loading jobs..." />}
      {error && (
        <div className="empty-state">
          <p className="error-message">{error}</p>
          <button className="btn btn-primary" onClick={() => loadJobs(filters)}>Try again</button>
        </div>
      )}

      {!loading && !error && visibleJobs.length === 0 && (
        <div className="empty-state">
          <h3>No jobs found</h3>
          <p>Try a different keyword, location, or job type.</p>
          <button className="btn btn-outline" onClick={() => {
            const cleared = { keyword: "", location: "", type: "" };
            setFilters(cleared);
            setSubmitted(cleared);
            loadJobs();
          }}>Clear filters</button>
        </div>
      )}

      {!loading && !error && visibleJobs.length > 0 && (
        <div className="job-grid">
          {visibleJobs.map((job) => (
            <JobCard key={job._id || job.id} job={job} />
          ))}
        </div>
      )}
    </section>
  );
}
