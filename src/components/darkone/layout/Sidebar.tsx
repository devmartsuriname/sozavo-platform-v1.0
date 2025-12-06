import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "../ui/Icon";

interface NavItem {
  title: string;
  href?: string;
  icon: string;
  badge?: string;
  children?: { title: string; href: string; badge?: string }[];
  disabled?: boolean;
}

const menuItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: "mingcute:home-3-line",
    badge: "03",
  },
  {
    title: "Authentication",
    icon: "mingcute:user-3-line",
    children: [
      { title: "Sign In", href: "/admin/auth/signin" },
      { title: "Sign Up", href: "/admin/auth/signup" },
      { title: "Reset Password", href: "/admin/auth/password" },
      { title: "Lock Screen", href: "/admin/auth/lock-screen" },
    ],
  },
  {
    title: "Error Pages",
    icon: "mingcute:bug-line",
    children: [
      { title: "Pages 404", href: "/admin/pages/404" },
      { title: "Pages 404 Alt", href: "/admin/pages/404-alt" },
    ],
  },
];

const uiKitItems: NavItem[] = [
  {
    title: "Base UI",
    icon: "mingcute:leaf-line",
    children: [
      { title: "Accordion", href: "/admin/ui/accordion" },
      { title: "Alerts", href: "/admin/ui/alerts" },
      { title: "Avatar", href: "/admin/ui/avatar" },
      { title: "Badge", href: "/admin/ui/badge" },
      { title: "Breadcrumb", href: "/admin/ui/breadcrumb" },
      { title: "Buttons", href: "/admin/ui/buttons" },
      { title: "Card", href: "/admin/ui/card" },
      { title: "Carousel", href: "/admin/ui/carousel" },
      { title: "Collapse", href: "/admin/ui/collapse" },
      { title: "Dropdown", href: "/admin/ui/dropdown" },
      { title: "List Group", href: "/admin/ui/list-group" },
      { title: "Modal", href: "/admin/ui/modal" },
      { title: "Tabs", href: "/admin/ui/tabs" },
      { title: "Offcanvas", href: "/admin/ui/offcanvas" },
      { title: "Pagination", href: "/admin/ui/pagination" },
      { title: "Placeholders", href: "/admin/ui/placeholders" },
      { title: "Popovers", href: "/admin/ui/popovers" },
      { title: "Progress", href: "/admin/ui/progress" },
      { title: "Scrollspy", href: "/admin/ui/scrollspy" },
      { title: "Spinners", href: "/admin/ui/spinners" },
      { title: "Toasts", href: "/admin/ui/toasts" },
      { title: "Tooltips", href: "/admin/ui/tooltips" },
    ],
  },
  {
    title: "Apex Charts",
    href: "/admin/charts",
    icon: "mingcute:chart-bar-line",
  },
  {
    title: "Forms",
    icon: "mingcute:box-line",
    children: [
      { title: "Basic Elements", href: "/admin/forms/basic" },
      { title: "Flatpicker", href: "/admin/forms/flatpicker" },
      { title: "Validation", href: "/admin/forms/validation" },
      { title: "File Upload", href: "/admin/forms/file-upload" },
      { title: "Editors", href: "/admin/forms/editors" },
    ],
  },
  {
    title: "Tables",
    icon: "mingcute:table-line",
    children: [
      { title: "Basic Tables", href: "/admin/tables/basic" },
      { title: "Grid Js", href: "/admin/tables/gridjs" },
    ],
  },
  {
    title: "Icons",
    icon: "mingcute:dribbble-line",
    children: [
      { title: "Boxicons", href: "/admin/icons/boxicons" },
      { title: "Solar Icons", href: "/admin/icons/solar" },
    ],
  },
  {
    title: "Maps",
    icon: "mingcute:map-line",
    children: [
      { title: "Google Maps", href: "/admin/maps/google" },
      { title: "Vector Maps", href: "/admin/maps/vector" },
    ],
  },
];

const otherItems: NavItem[] = [
  {
    title: "Layouts",
    icon: "mingcute:layout-line",
    children: [
      { title: "Dark Sidenav", href: "/admin/layouts/dark-sidenav" },
      { title: "Dark Topnav", href: "/admin/layouts/dark-topnav" },
      { title: "Small Sidenav", href: "/admin/layouts/small-sidenav" },
      { title: "Hidden Sidenav", href: "/admin/layouts/hidden-sidenav" },
      { title: "Light Mode", href: "/admin/layouts/light", badge: "Hot" },
    ],
  },
  {
    title: "Menu Item",
    icon: "mingcute:menu-line",
    children: [
      { title: "Menu Item 1", href: "#" },
      { title: "Menu Item 2", href: "#" },
    ],
  },
  {
    title: "Disable Item",
    icon: "mingcute:close-circle-line",
    disabled: true,
  },
];

const NavItemComponent = ({ item }: { item: NavItem }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const isActive = item.href === location.pathname;
  const hasChildren = item.children && item.children.length > 0;

  if (item.disabled) {
    return (
      <li className="nav-item">
        <span className="nav-link disabled" style={{ opacity: 0.5, cursor: "not-allowed" }}>
          <span className="nav-icon">
            <Icon icon={item.icon} />
          </span>
          <span className="nav-text">{item.title}</span>
        </span>
      </li>
    );
  }

  if (hasChildren) {
    return (
      <li className="nav-item">
        <a
          className={`nav-link menu-arrow`}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
          aria-expanded={isOpen}
        >
          <span className="nav-icon">
            <Icon icon={item.icon} />
          </span>
          <span className="nav-text">{item.title}</span>
        </a>
        <div className={`collapse ${isOpen ? "show" : ""}`}>
          <ul className="nav sub-navbar-nav">
            {item.children?.map((child) => (
              <li key={child.title} className="sub-nav-item">
                <Link className="sub-nav-link" to={child.href}>
                  {child.title}
                  {child.badge && (
                    <span className="badge badge-soft-danger badge-pill text-end ms-2">
                      {child.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </li>
    );
  }

  return (
    <li className="nav-item">
      <Link className={`nav-link ${isActive ? "active" : ""}`} to={item.href || "#"}>
        <span className="nav-icon">
          <Icon icon={item.icon} />
        </span>
        <span className="nav-text">{item.title}</span>
        {item.badge && (
          <span className="badge bg-primary badge-pill text-end">{item.badge}</span>
        )}
      </Link>
    </li>
  );
};

const Sidebar = () => {
  return (
    <div className="app-sidebar">
      {/* Sidebar Logo */}
      <div className="logo-box">
        <Link to="/admin" className="logo-dark">
          <img src="/darkone/images/logo-sm.png" className="logo-sm" alt="logo sm" />
          <img src="/darkone/images/logo-dark.png" className="logo-lg" alt="logo dark" />
        </Link>

        <Link to="/admin" className="logo-light">
          <img src="/darkone/images/logo-sm.png" className="logo-sm" alt="logo sm" />
          <img src="/darkone/images/logo-light.png" className="logo-lg" alt="logo light" />
        </Link>
      </div>

      <div className="scrollbar">
        <ul className="navbar-nav" id="navbar-nav">
          <li className="menu-title">Menu...</li>
          {menuItems.map((item) => (
            <NavItemComponent key={item.title} item={item} />
          ))}

          <li className="menu-title">UI Kit...</li>
          {uiKitItems.map((item) => (
            <NavItemComponent key={item.title} item={item} />
          ))}

          <li className="menu-title">Other</li>
          {otherItems.map((item) => (
            <NavItemComponent key={item.title} item={item} />
          ))}
        </ul>
      </div>

      <div className="animated-stars">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="shooting-star"></div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
