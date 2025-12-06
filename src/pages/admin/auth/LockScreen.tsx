import { Link } from "react-router-dom";
import { useEffect } from "react";

const LockScreen = () => {
  useEffect(() => {
    document.body.classList.add('authentication-bg');
    return () => {
      document.body.classList.remove('authentication-bg');
    };
  }, []);

  return (
    <div className="account-pages py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card border-0 shadow-lg">
              <div className="card-body p-5">
                <div className="text-center">
                  <div className="mx-auto mb-4 text-center auth-logo">
                    <Link to="/admin" className="logo-dark">
                      <img 
                        src="/darkone/images/logo-dark.png" 
                        alt="logo dark" 
                        height="32"
                      />
                    </Link>
                    <Link to="/admin" className="logo-light">
                      <img 
                        src="/darkone/images/logo-light.png" 
                        alt="logo light" 
                        height="28"
                      />
                    </Link>
                  </div>
                  <h4 className="fw-bold text-dark mb-2">Hi ! Gaston</h4>
                  <p className="text-muted">Enter your password to access the admin.</p>
                </div>

                <form className="mt-4">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="example-password">Password</label>
                    <input 
                      type="password" 
                      id="example-password" 
                      className="form-control"
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input 
                        type="checkbox" 
                        className="form-check-input" 
                        id="checkbox-signin"
                      />
                      <label className="form-check-label" htmlFor="checkbox-signin">
                        I accept Terms and Condition
                      </label>
                    </div>
                  </div>

                  <div className="mb-1 text-center d-grid">
                    <button className="btn btn-dark btn-lg fw-medium" type="submit">
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <p className="text-center mt-4 text-white text-opacity-50">
              Not you? return{" "}
              <Link to="/admin/auth/signup" className="text-decoration-none text-white fw-bold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
