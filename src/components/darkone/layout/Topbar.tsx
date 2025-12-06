import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../ui/Icon";

const Topbar = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="app-topbar">
      <div className="container-fluid">
        <div className="navbar-header">
          <div className="d-flex align-items-center gap-2">
            {/* Menu Toggle Button */}
            <div className="topbar-item">
              <button type="button" className="button-toggle-menu topbar-button">
                <Icon icon="solar:hamburger-menu-outline" className="fs-24 align-middle" />
              </button>
            </div>

            {/* App Search */}
            <form className="app-search d-none d-md-block me-auto">
              <div className="position-relative">
                <input
                  type="search"
                  className="form-control"
                  placeholder="admin,widgets..."
                  autoComplete="off"
                />
                <span className="search-widget-icon">
                  <Icon icon="solar:magnifer-outline" />
                </span>
              </div>
            </form>
          </div>

          <div className="d-flex align-items-center gap-2">
            {/* Theme Color (Light/Dark) */}
            <div className="topbar-item">
              <button type="button" className="topbar-button" id="light-dark-mode">
                <Icon icon="solar:moon-outline" className="fs-22 align-middle" />
              </button>
            </div>

            {/* Notification */}
            <div className="dropdown topbar-item">
              <button
                type="button"
                className="topbar-button position-relative"
                id="page-header-notifications-dropdown"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Icon icon="solar:bell-bing-outline" className="fs-22 align-middle" />
                <span className="position-absolute topbar-badge fs-10 translate-middle badge bg-danger rounded-pill">
                  5<span className="visually-hidden">unread messages</span>
                </span>
              </button>
              <div className={`dropdown-menu py-0 dropdown-lg dropdown-menu-end ${notificationsOpen ? "show" : ""}`}>
                <div className="p-2 border-bottom bg-light bg-opacity-50">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="m-0 fs-16 fw-semibold">Notifications (5)</h6>
                    </div>
                    <div className="col-auto">
                      <a href="#" className="text-dark text-decoration-underline">
                        <small>Clear All</small>
                      </a>
                    </div>
                  </div>
                </div>
                <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                  {/* Notification Item 1 */}
                  <a href="#" className="dropdown-item p-2 border-bottom text-wrap">
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <img
                          src="/darkone/images/users/avatar-1.jpg"
                          className="img-fluid me-2 avatar-sm rounded-circle"
                          alt="avatar-1"
                        />
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-0">
                          <span className="fw-medium">Sally Bieber </span>started following you. Check out their profile!
                        </p>
                      </div>
                    </div>
                  </a>
                  {/* Notification Item 2 */}
                  <a href="#" className="dropdown-item p-2 border-bottom">
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <div className="avatar-sm me-2">
                          <span
                            className="avatar-title rounded-circle"
                            style={{ backgroundColor: "rgba(26, 176, 248, 0.18)", color: "#1ab0f8" }}
                          >
                            G
                          </span>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-0 fw-medium">Gloria Chambers</p>
                        <p className="mb-0 text-wrap">mentioned you in a comment: '@admin, check this out!</p>
                      </div>
                    </div>
                  </a>
                  {/* Notification Item 3 */}
                  <a href="#" className="dropdown-item p-2 border-bottom">
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <img
                          src="/darkone/images/users/avatar-3.jpg"
                          className="img-fluid me-2 avatar-sm rounded-circle"
                          alt="avatar-3"
                        />
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-0 fw-medium">Jacob Gines</p>
                        <p className="mb-0 text-wrap">
                          Answered to your comment on the cash flow forecast's graph 🔔.
                        </p>
                      </div>
                    </div>
                  </a>
                  {/* Notification Item 4 */}
                  <a href="#" className="dropdown-item p-2 border-bottom">
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <div className="avatar-sm me-2">
                          <span
                            className="avatar-title rounded-circle fs-20"
                            style={{ backgroundColor: "rgba(240, 147, 78, 0.18)", color: "#f0934e" }}
                          >
                            <Icon icon="solar:leaf-outline" />
                          </span>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-0 fw-medium text-wrap">
                          A new system update is available. Update now for the latest features.
                        </p>
                      </div>
                    </div>
                  </a>
                  {/* Notification Item 5 */}
                  <a href="#" className="dropdown-item p-2 border-bottom">
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <img
                          src="/darkone/images/users/avatar-5.jpg"
                          className="img-fluid me-2 avatar-sm rounded-circle"
                          alt="avatar-5"
                        />
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-0 fw-medium">Shawn Bunch</p>
                        <p className="mb-0 text-wrap">commented on your post: 'Great photo!</p>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="text-center p-2">
                  <a href="#" className="btn btn-primary btn-sm">
                    View All Notification <i className="bx bx-right-arrow-alt ms-1"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* User */}
            <div className="dropdown topbar-item">
              <a
                className="topbar-button"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setUserMenuOpen(!userMenuOpen);
                }}
              >
                <span className="d-flex align-items-center">
                  <img
                    className="rounded-circle"
                    width="32"
                    src="/darkone/images/users/avatar-1.jpg"
                    alt="avatar-3"
                  />
                </span>
              </a>
              <div className={`dropdown-menu dropdown-menu-end ${userMenuOpen ? "show" : ""}`}>
                <h6 className="dropdown-header">Welcome!</h6>
                <a className="dropdown-item" href="#">
                  <Icon icon="solar:user-outline" className="align-middle me-2 fs-18" />
                  <span className="align-middle">My Account</span>
                </a>
                <a className="dropdown-item" href="#">
                  <Icon icon="solar:wallet-outline" className="align-middle me-2 fs-18" />
                  <span className="align-middle">Pricing</span>
                </a>
                <a className="dropdown-item" href="#">
                  <Icon icon="solar:help-outline" className="align-middle me-2 fs-18" />
                  <span className="align-middle">Help</span>
                </a>
                <Link className="dropdown-item" to="/admin/auth/lock-screen">
                  <Icon icon="solar:lock-keyhole-outline" className="align-middle me-2 fs-18" />
                  <span className="align-middle">Lock screen</span>
                </Link>
                <div className="dropdown-divider my-1"></div>
                <Link className="dropdown-item text-danger" to="/admin/auth/signin">
                  <Icon icon="solar:logout-3-outline" className="align-middle me-2 fs-18" />
                  <span className="align-middle">Logout</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
