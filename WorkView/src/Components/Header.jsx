import { Link, Outlet } from "react-router-dom";
import "../css/Header.css";

export default function Header() {
  return (
    <>
      <div className="nav-head">
        <li>
          <Link to="/">Work view</Link>
        </li>
        <div className="nav">
          <li>
            <Link to="/login">Log in</Link>
          </li>
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
