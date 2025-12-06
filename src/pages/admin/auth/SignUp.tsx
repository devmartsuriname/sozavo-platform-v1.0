const SignUp = () => {
  return (
    <div className="authentication-bg">
      <div className="account-pages">
        <div className="card border-0 shadow-lg">
          <div className="card-body p-5">
            <div className="text-center">
              <div className="mx-auto mb-4 text-center auth-logo">
                <a href="/admin">
                  <img src="/darkone/images/logo-dark.png" height="32" alt="logo" className="logo-dark" />
                  <img src="/darkone/images/logo-light.png" height="28" alt="logo" className="logo-light" />
                </a>
              </div>
              <h4 className="fw-bold mb-2">Sign Up</h4>
              <p className="text-muted">
                New to our platform? Sign up now! It only takes a minute.
              </p>
            </div>

            <form action="/admin" className="mt-4">
              <div className="mb-3">
                <label className="form-label" htmlFor="example-name">Name</label>
                <input
                  type="text"
                  id="example-name"
                  name="example-name"
                  className="form-control"
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="example-email">Email</label>
                <input
                  type="email"
                  id="example-email"
                  name="example-email"
                  className="form-control"
                  placeholder="Enter your email"
                />
              </div>
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
                  <input type="checkbox" className="form-check-input" id="checkbox-signin" />
                  <label className="form-check-label" htmlFor="checkbox-signin">
                    I accept Terms and Condition
                  </label>
                </div>
              </div>

              <div className="mb-1 text-center d-grid">
                <button className="btn btn-dark btn-lg fw-medium" type="submit">
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
        <p className="text-center mt-4 text-white text-opacity-50">
          I already have an account{" "}
          <a href="/admin/auth/signin" className="text-decoration-none text-white fw-bold">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;