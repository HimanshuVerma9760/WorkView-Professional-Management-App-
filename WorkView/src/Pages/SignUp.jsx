import { Link, useLocation } from "react-router-dom";
import FormCard from "../Components/FormCard";
import "../css/Signup.css";
import { motion } from "framer-motion";

export default function SignUp() {
  const location = useLocation();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="login-head">
          <div>
            <h2>Free Plan</h2>
            <h1>
              Create your WorkView account and start using WorkView for free
            </h1>
          </div>
          <div>
            <h3>
              Already have a WorkView Account?{" "}
              <Link to="/login" className="login-link">
                Log in to try WorkView
              </Link>
            </h3>
          </div>
          <div className="signup-options">
            <Link
              to="/sign-up"
              className={`link ${
                location.pathname === "/sign-up" ? "link_active" : ""
              }`}
            >
              Team Leader Sign up
            </Link>
            <Link
              to="/member-sign-up"
              className={`link ${
                location.pathname === "/member-sign-up" ? "link_active" : ""
              }`}
            >
              Team Member Sign up
            </Link>
          </div>
        </div>
        <div className="form-card">
          <FormCard />
        </div>
      </motion.div>
    </>
  );
}
