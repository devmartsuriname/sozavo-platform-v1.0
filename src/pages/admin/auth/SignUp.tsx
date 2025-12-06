import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!acceptTerms) {
      setError("You must accept the Terms and Conditions");
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/admin`;
      
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: name,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError("This email is already registered. Please sign in instead.");
        } else {
          setError(signUpError.message);
        }
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="authentication-bg">
        <div className="account-pages">
          <div className="card border-0 shadow-lg">
            <div className="card-body p-5">
              <div className="text-center">
                <div className="mx-auto mb-4 text-center auth-logo">
                  <Link to="/admin">
                    <img src="/darkone/images/logo-dark.png" height="32" alt="logo" className="logo-dark" />
                    <img src="/darkone/images/logo-light.png" height="28" alt="logo" className="logo-light" />
                  </Link>
                </div>
                <div className="mb-4">
                  <i className="bx bx-check-circle text-success" style={{ fontSize: "48px" }}></i>
                </div>
                <h4 className="fw-bold mb-2">Check Your Email</h4>
                <p className="text-muted">
                  We've sent a confirmation link to <strong>{email}</strong>. 
                  Please check your inbox and click the link to verify your account.
                </p>
                <Link to="/admin/auth/signin" className="btn btn-dark mt-3">
                  Go to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="authentication-bg">
      <div className="account-pages">
        <div className="card border-0 shadow-lg">
          <div className="card-body p-5">
            <div className="text-center">
              <div className="mx-auto mb-4 text-center auth-logo">
                <Link to="/admin">
                  <img src="/darkone/images/logo-dark.png" height="32" alt="logo" className="logo-dark" />
                  <img src="/darkone/images/logo-light.png" height="28" alt="logo" className="logo-light" />
                </Link>
              </div>
              <h4 className="fw-bold mb-2">Sign Up</h4>
              <p className="text-muted">
                New to our platform? Sign up now! It only takes a minute.
              </p>
            </div>

            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-3">
                <label className="form-label" htmlFor="example-name">Name</label>
                <input
                  type="text"
                  id="example-name"
                  name="example-name"
                  className="form-control"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="example-password">Password</label>
                <input
                  type="password"
                  id="example-password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="checkbox-signin"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    disabled={isLoading}
                  />
                  <label className="form-check-label" htmlFor="checkbox-signin">
                    I accept Terms and Condition
                  </label>
                </div>
              </div>

              <div className="mb-1 text-center d-grid">
                <button 
                  className="btn btn-dark btn-lg fw-medium" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing Up..." : "Sign Up"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <p className="text-center mt-4 text-white text-opacity-50">
          I already have an account{" "}
          <Link to="/admin/auth/signin" className="text-decoration-none text-white fw-bold">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
