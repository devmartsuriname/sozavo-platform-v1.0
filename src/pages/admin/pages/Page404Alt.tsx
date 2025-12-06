import { Link } from "react-router-dom";
import { useEffect } from "react";

const Page404Alt = () => {
  useEffect(() => {
    document.body.classList.add('authentication-page');
    return () => {
      document.body.classList.remove('authentication-page');
    };
  }, []);

  return (
    <div className="auth-bg d-flex min-vh-100 justify-content-center align-items-center">
      <div className="row g-0 justify-content-center w-100">
        <div className="col-lg-8 col-xl-6">
          <div className="card mb-0 border-0 shadow-lg">
            <div className="card-body p-5 text-center">
              <div className="mb-4">
                <img 
                  src="/darkone/images/logo-dark.png" 
                  alt="logo" 
                  height="28" 
                  className="logo-dark"
                />
                <img 
                  src="/darkone/images/logo-light.png" 
                  alt="logo" 
                  height="28" 
                  className="logo-light"
                />
              </div>
              <h1 className="text-primary fw-bold" style={{ fontSize: "120px" }}>404</h1>
              <h3 className="text-dark fw-semibold">Oops! Page Not Found</h3>
              <p className="text-muted mb-4">
                It seems like the page you're looking for doesn't exist. Don't worry, let's get you back on track.
              </p>
              <div className="d-flex justify-content-center gap-2">
                <Link to="/admin" className="btn btn-primary">
                  Go to Dashboard
                </Link>
                <button className="btn btn-outline-primary" onClick={() => window.history.back()}>
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page404Alt;
