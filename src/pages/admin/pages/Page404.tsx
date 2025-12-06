import { Link } from "react-router-dom";
import { useEffect } from "react";

const Page404 = () => {
  useEffect(() => {
    document.body.classList.add('authentication-page');
    return () => {
      document.body.classList.remove('authentication-page');
    };
  }, []);

  return (
    <div className="auth-bg d-flex min-vh-100 justify-content-center align-items-center">
      <div className="row g-0 justify-content-center w-100">
        <div className="col-lg-6 col-xl-4">
          <div className="card mb-0 border-0 shadow-lg">
            <div className="card-body p-4 text-center">
              <h1 className="display-1 text-primary fw-bold">404</h1>
              <h4 className="text-dark fw-semibold mt-3">Page Not Found</h4>
              <p className="text-muted">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
              </p>
              <Link to="/admin" className="btn btn-primary mt-3">
                <i className="bx bx-home me-1"></i> Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page404;
