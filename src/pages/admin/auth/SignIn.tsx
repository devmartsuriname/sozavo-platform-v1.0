const SignIn = () => {
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
              <h4 className="fw-bold mb-2">Welcome Back!</h4>
              <p className="text-muted">Sign in to your account to continue</p>
            </div>
            <form action="/admin" className="mt-4">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input type="email" className="form-control" id="email" placeholder="Enter your email" />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <label htmlFor="password" className="form-label">Password</label>
                  <a href="/admin/auth/reset-password" className="text-decoration-none small text-muted">Forgot password?</a>
                </div>
                <input type="password" className="form-control" id="password" placeholder="Enter your password" />
              </div>
              <div className="form-check mb-3">
                <input type="checkbox" className="form-check-input" id="remember-me" />
                <label className="form-check-label" htmlFor="remember-me">Remember me</label>
              </div>
              <div className="d-grid">
                <button className="btn btn-dark btn-lg fw-medium" type="submit">Sign In</button>
              </div>
            </form>
          </div>
        </div>
        <p className="text-center mt-4 text-white text-opacity-50">
          Don't have an account?{" "}
          <a href="/admin/auth/signup" className="text-decoration-none text-white fw-bold">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;