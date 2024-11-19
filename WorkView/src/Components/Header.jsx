import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "../css/Header.css";
import { useEffect, useState } from "react";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.split("/")[2];
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    path === "dashboard" ? setIsLogin(true) : setIsLogin(false);
  }, [location]);

  function logoutHandler() {
    localStorage.removeItem("token");
    localStorage.removeItem("whichDash");
    navigate("/login");
  }

  return (
    <>
      <div className="nav-head">
        <li>
          <Link to="/">Work view</Link>
        </li>
        <div className="nav">
          {isLogin ? (
            <li>
              <Link onClick={logoutHandler}>Log out</Link>
            </li>
          ) : (
            <li>
              <Link to="/login">Log in</Link>
            </li>
          )}
          <li>
            <Link to="/contact-us">Contact us</Link>
          </li>
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </>
  );
}
