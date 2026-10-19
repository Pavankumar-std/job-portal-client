
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <Link className="brand footer-brand" to="/">
            Career<span>Connect</span>
          </Link>
          <p>Helping you discover your next opportunity.</p>
        </div>
        <div className="footer-links">
          <Link to="/jobs">Explore Jobs</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </div>
      <p className="copyright">
        © {new Date().getFullYear()} CareerConnect · DG Interns Hub Week 9 Project
      </p>
    </footer>
  );
}
