import { Link } from "react-router-dom";
import { useEffect } from "react";

const ResetPassword = () => {
  useEffect(() => {
    document.body.classList.add('authentication-page');
    return () => {
      document.body.classList.remove('authentication-page');
    };
  }, []);

  return (
    <div className="auth-bg d-flex min-vh-100 justify-content-center align-items-center">
      <div className="row g-0 justify-content-center w-100">
        <div className="col-xl-4 col-lg-5 col-md-6">
          <div className="card mb-0 border-0 shadow-lg">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <Link to="/admin">
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
                </Link>
                <h4 className="mt-4 fw-semibold text-dark fs-20">Reset Password</h4>
                <p className="text-muted mb-0">Enter your email to reset your password</p>
              </div>

              <form className="pt-2">
                <div className="form-group mb-3">
                  <label className="form-label" htmlFor="emailaddress">Email Address</label>
                  <input 
                    className="form-control" 
                    type="email" 
                    id="emailaddress" 
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-group mb-0 row">
                  <div className="col-12">
                    <div className="d-grid">
                      <button className="btn btn-primary" type="submit">
                        Reset Password
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted mb-0">
                  Remember your password? <Link to="/admin/auth/signin" className="text-dark fw-medium">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
