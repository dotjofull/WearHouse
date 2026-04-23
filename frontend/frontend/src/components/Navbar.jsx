import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar sticky-top shadow-sm">
      <div className="container py-2">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          WearHouse
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <div className="navbar-nav mx-auto gap-lg-2">
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>

            {user && (
              <NavLink className="nav-link" to="/cart">
                Cart
              </NavLink>
            )}

            {user && (
              <NavLink className="nav-link" to="/orders">
                My Orders
              </NavLink>
            )}

            {isAdmin && (
              <NavLink className="nav-link" to="/admin">
                Admin
              </NavLink>
            )}
          </div>

          <div className="d-flex gap-2">
            {!user ? (
              <>
                <NavLink className="btn btn-outline-light btn-sm px-3" to="/login">
                  Login
                </NavLink>
                <NavLink className="btn btn-light btn-sm px-3" to="/register">
                  Register
                </NavLink>
              </>
            ) : (
              <button className="btn btn-danger btn-sm px-3" onClick={logout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;