import { Link } from "react-router-dom";

const ResetPassword = () => {
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
                  <div className="text-center">
                    <h4 className="fw-bold mb-2">Reset Password</h4>
                    <p className="text-muted">Enter your email to reset your password</p>
                  </div>

                  <form className="mt-4">
                    <div className="mb-3">
                      <label className="form-label" htmlFor="emailaddress">Email Address</label>
                      <input 
                        className="form-control" 
                        type="email" 
                        id="emailaddress" 
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="d-grid">
                      <button className="btn btn-dark btn-lg fw-medium" type="submit">
                        Reset Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <p className="text-center mt-4 text-white text-opacity-50">
                Remember your password?{" "}
                <Link to="/admin/auth/signin" className="text-decoration-none text-white fw-bold">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
