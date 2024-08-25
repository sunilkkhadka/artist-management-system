import { useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { Link, useHistory } from "react-router-dom";

import { useAuth, useLogout } from "../../features/auth/hooks/useAuth";

const Header = () => {
  const auth = useAuth();
  const history = useHistory();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (!auth.isLoggedIn) {
      history.push("/login");
    }
  }, [auth.isLoggedIn, history]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="header">
      <nav className="header__nav">
        <Link to="/" className="header__logo">
          Melodia
        </Link>
        <ul className="header__nav-links">
          {auth.isLoggedIn && (
            <>
              <li className="header__profile">
                <CgProfile className="header__profile-icon" /> {auth.username}
              </li>
              <li>
                <Link
                  to="/logout"
                  className="header__logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </Link>
              </li>
            </>
          )}
          {!auth.isLoggedIn && (
            <>
              <li>
                <Link to="#" className="header__logout-btn">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="header__logout-btn">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
