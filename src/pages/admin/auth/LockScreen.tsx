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
                <div className="text-center mb-4">
                  <Link to="/admin" className="logo-dark">
                    <img 
                      src="/darkone/images/logo-dark.png" 
                      alt="logo" 
                      height="28"
                    />
                  </Link>
                  <Link to="/admin" className="logo-light">
                    <img 
                      src="/darkone/images/logo-light.png" 
                      alt="logo" 
                      height="28"
                    />
                  </Link>
                </div>

                <div className="text-center mb-4">
                  <img 
                    src="/darkone/images/users/avatar-1.jpg" 
                    alt="user" 
                    className="rounded-circle avatar-lg img-thumbnail"
                  />
                  <h4 className="mt-3 fw-semibold fs-18">Hi! John Doe</h4>
                  <p className="text-muted mb-0">Enter your password to access the admin.</p>
                </div>

                <form className="pt-2">
                  <div className="form-group mb-3">
                    <label className="form-label" htmlFor="password">Password</label>
                    <input 
                      className="form-control" 
                      type="password" 
                      id="password" 
                      placeholder="Enter your password"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <div className="form-check">
                      <input 
                        type="checkbox" 
                        className="form-check-input" 
                        id="termsCheck"
                      />
                      <label className="form-check-label" htmlFor="termsCheck">
                        I agree to the <a href="#" className="text-dark">Terms and Conditions</a>
                      </label>
                    </div>
                  </div>

                  <div className="form-group mb-0">
                    <div className="d-grid">
                      <button className="btn btn-dark btn-lg fw-medium" type="submit">
                        Sign In
                      </button>
                    </div>
                  </div>
                </form>

                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Not you? <Link to="/admin/auth/signup" className="text-dark fw-medium">Sign Up</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
