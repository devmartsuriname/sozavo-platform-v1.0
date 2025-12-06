import { Link } from "react-router-dom";

const LockScreen = () => {
  return (
    <div className="authentication-bg">
      <div className="account-pages py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5 col-xl-4">
              <div className="card border-0 shadow-lg">
                <div className="card-body p-5">
                  <div className="mx-auto mb-4 text-center auth-logo">
                    <Link to="/admin" className="logo-dark">
                      <img src="/darkone/images/logo-dark.png" height="32" alt="logo" />
                    </Link>
                    <Link to="/admin" className="logo-light">
                      <img src="/darkone/images/logo-light.png" height="28" alt="logo" />
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

                  <form className="mt-4">
                    <div className="mb-3">
                      <label className="form-label" htmlFor="password">Password</label>
                      <input 
                        className="form-control" 
                        type="password" 
                        id="password" 
                        placeholder="Enter your password"
                      />
                    </div>

                    <div className="form-check mb-3">
                      <input 
                        type="checkbox" 
                        className="form-check-input" 
                        id="termsCheck"
                      />
                      <label className="form-check-label" htmlFor="termsCheck">
                        I agree to the <a href="#" className="text-dark">Terms and Conditions</a>
                      </label>
                    </div>

                    <div className="d-grid">
                      <button className="btn btn-dark btn-lg fw-medium" type="submit">
                        Sign In
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <p className="text-center mt-4 text-white text-opacity-50">
                Not you? <Link to="/admin/auth/signup" className="text-decoration-none text-white fw-bold">Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
