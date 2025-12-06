import { Link } from "react-router-dom";

/**
 * Phase 9C: Access Denied Page
 * Shown when user attempts to access a module they don't have permission for
 */
const AccessDenied = () => {
  return (
    <div className="authentication-bg min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card overflow-hidden">
              <div className="card-body p-4 text-center">
                {/* Warning Icon */}
                <div className="mb-4">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10" 
                    style={{ width: "80px", height: "80px" }}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="40" 
                      height="40" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="text-danger"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                </div>

                {/* Title */}
                <h4 className="mb-2">Access Denied</h4>
                
                {/* Description */}
                <p className="text-muted mb-4">
                  You do not have permission to view this page. Please contact your administrator if you believe this is an error.
                </p>

                {/* Action Button */}
                <Link to="/admin" className="btn btn-primary">
                  <i className="bx bx-home-alt me-1"></i>
                  Go to Dashboard
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-muted mb-0">
                Need help? <a href="mailto:support@sozavo.sr" className="text-primary">Contact Support</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
