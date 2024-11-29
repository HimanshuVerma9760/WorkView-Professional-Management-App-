import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import CryptoJs from "crypto-js";

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

  const whichDash = localStorage.getItem("whichDash");
  const token = localStorage.getItem("token");
  let whichModule;
  try {
    whichModule = CryptoJs.AES.decrypt(whichDash, token).toString(
      CryptoJs.enc.Utf8
    );
  } catch (error) {
    console.log("Error occured during cryptoJs decryption!");
  }
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
            <>
              <li>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    logoutHandler();
                  }}
                >
                  Log out
                </Link>
              </li>
              <li>
                <Link to="/team-leader/dashboard/assign-task">
                  {whichModule === "member" ? "Your Tasks" : "Assign task"}
                </Link>
              </li>
              <li>
                <Link to={`/${whichModule}/dashboard`}>Dashboard</Link>
              </li>
            </>
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
