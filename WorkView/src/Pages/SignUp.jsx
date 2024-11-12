import { Link } from "react-router-dom";
import FormCard from "../Components/FormCard";
import "../css/Signup.css";

export default function SignUp() {
  const loginHead = {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    margin: "auto",
    maxWidth: "50%",
  };
  return (
    <>
      <div style={loginHead}>
        <h2>Free Plan</h2>
        <h1>Create your WorkView account and start using WorkView for free</h1>
        <h3>
          Already have a WorkView Account?{" "}
          <Link to="/login" style={{ color: "black" }}>
            Log in to try WorkView
          </Link>
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            margin: "2rem",
          }}
        >
          <Link
            to="/sign-up"
            className={`link${
              location.pathname === "/sign-up" ? "_active" : ""
            }`}
          >
            Team Leader Sign up
          </Link>
          <Link
            to="/member-sign-up"
            className={`link${
              location.pathname === "/member-sign-up" ? "_active" : ""
            }`}
          >
            Team Member Sign up
          </Link>
        </div>
      </div>
      <div className="formCard">
        <FormCard />
      </div>
    </>
  );
}
