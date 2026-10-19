
export default function SearchBar({ filters, setFilters, onSearch }) {
  function update(key, value) {
    setFilters((previous) => ({ ...previous, [key]: value }));
  }

  return (
    <form className="search-panel" onSubmit={(e) => {
      e.preventDefault();
      onSearch();
    }}>
      <div className="form-group search-keyword">
        <label htmlFor="keyword">Job title or keyword</label>
        <input id="keyword" value={filters.keyword}
          onChange={(e) => update("keyword", e.target.value)}
          placeholder="e.g. React Developer" />
      </div>

      <div className="form-group">
        <label htmlFor="location">Location</label>
        <input id="location" value={filters.location}
          onChange={(e) => update("location", e.target.value)}
          placeholder="Remote, Hyderabad..." />
      </div>

      <div className="form-group">
        <label htmlFor="type">Job type</label>
        <select id="type" value={filters.type}
          onChange={(e) => update("type", e.target.value)}>
          <option value="">All types</option>
          <option value="Internship">Internship</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Remote">Remote</option>
        </select>
      </div>

      <button className="btn btn-primary" type="submit">Search Jobs</button>
    </form>
  );
}
