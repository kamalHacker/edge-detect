import { NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition
   ${isActive ? "bg-primary text-white" : "text-textSecondary hover:text-textPrimary hover:bg-surface"}`;

const Navbar = () => {
  return (
    <header className="shadow-md border-border bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-2 font-bold text-primary text-sm sm:text-md md:text-lg lg:text-xl">
          <img
            src="/logo.svg"
            alt="App Logo"
            className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14"
          />
          <p>X-ray Edge Detection</p>
        </div>

        <nav className="flex gap-2 items-center">
          <NavLink to="/" className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/results" className={navLinkClass}>
            Results
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
