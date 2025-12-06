import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/integrations/supabase/AuthContext';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect to admin
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  // Redirect if already authenticated
  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      setIsLoading(false);
      return;
    }

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      // Map common Supabase auth errors to user-friendly messages
      if (signInError.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (signInError.message.includes('Email not confirmed')) {
        setError('Please confirm your email address before signing in.');
      } else {
        setError(signInError.message);
      }
      setIsLoading(false);
      return;
    }

    // Successful login - navigate to intended destination
    navigate(from, { replace: true });
  };

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

            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <label htmlFor="password" className="form-label">Password</label>
                  <a href="/admin/auth/password" className="text-decoration-none small text-muted">Forgot password?</a>
                </div>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <label className="form-check-label" htmlFor="remember-me">Remember me</label>
              </div>
              <div className="d-grid">
                <button
                  className="btn btn-dark btn-lg fw-medium"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
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
