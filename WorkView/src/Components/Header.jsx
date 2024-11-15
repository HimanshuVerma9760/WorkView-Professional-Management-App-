import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "../css/Header.css";
import { useEffect, useState } from "react";
import LogOut from "./LogOut";

export default function Header() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    localStorage.getItem("token") ? setIsLogin(true) : setIsLogin(false);
  }, [location]);

  return (
    <>
      <div className="nav-head">
        <li>
          <Link to="/">Work view</Link>
        </li>
        <div className="nav">
          {isLogin ? (
            <li>
              <Link to="/team-leader/dashboard">Dashboard</Link>
              <Link onClick={LogOut}>Log out</Link>
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
