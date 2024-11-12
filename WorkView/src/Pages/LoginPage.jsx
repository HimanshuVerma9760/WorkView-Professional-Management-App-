import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../css/LoginPage.css";
import "../css/FormCard.css";

export default function LoginPage() {
  const apiName = useRef("team-leader");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [error, setError] = useState(false);
  const [dbError, setDbError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [teamCodeError, setTeamCodeError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setDbError("");
    setEmail("");
    setEmailError("");
    setError("");
    setPassword("");
    setPasswordError("");
    setTeamCode("");
    setTeamCodeError("");
  }, [apiName.current]);

  if (location.pathname === "/member-login") {
    apiName.current = "member";
  } else if (location.pathname === "/login") {
    apiName.current = "team-leader";
  }

  function handleChange(event) {
    setError(false);
    const key = event.target.id;
    const value = event.target.value;
    switch (key) {
      case "email":
        setEmailError("");
        setEmail(value);
        break;
      case "pwd":
        setPasswordError("");
        setPassword(value);
        break;
      case "teamCode":
        setTeamCodeError("");
        setTeamCode(value);
        break;
      default:
    }
  }

  async function submitHandler(event) {
    event.preventDefault();
    let valid = true;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError("Invalid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      valid = false;
    } else {
      setPasswordError("");
    }
    if (apiName.current === "member") {
      if (teamCode.length < 10) {
        setTeamCodeError("Team Code length must be 10");
        valid = false;
      } else {
        setTeamCodeError("");
      }
    }

    if (valid) {
      let formData;
      if (apiName.current === "team-leader") {
        formData = {
          leaderEmail: email,
          leaderPassword: password,
        };
      } else {
        formData = {
          memberEmail: email,
          memberPassword: password,
          teamCode: teamCode,
        };
      }
      let response;
      try {
        response = await fetch(
          `http://localhost:3000/${apiName.current}/api-login-${apiName.current}`,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
      } catch (error) {
        setError(true);
        setDbError(error);
      }
      if (!response || !response.ok) {
        if (response !== undefined) {
          const errorData = await response.json();
          setError(true);
          setDbError(errorData.error);
        } else {
          setError(true);
          setDbError("Sorry..! Try Again Later");
        }
      } else {
        navigate("/login");
      }
      setEmail("");
      setPassword("");
      setTeamCode("");
    } else {
      console.log("invalid");
    }
  }
  return (
    <>
      <div>
        <div className="mainHead">
          <h1>Log in to your WorkView Account</h1>
          <h2>Professionals Personal Tab</h2>
        </div>
        <div className="mainForm">
          <div style={{ textAlign: "center" }}>
            <h3>
              Login or <Link to="/sign-up">Create an account</Link>
            </h3>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "2rem",
              }}
            >
              <Link
                to="/login"
                className={`link${
                  location.pathname === "/login" ? "_active" : ""
                }`}
              >
                Team Leader login
              </Link>
              <Link
                to="/member-login"
                className={`link${
                  location.pathname === "/member-login" ? "_active" : ""
                }`}
              >
                Team Member login
              </Link>
            </div>
          </div>
          <form method="post" onSubmit={submitHandler}>
            <div style={{ marginTop: "5rem" }}>
              <div className="errorContainer">{error ? dbError : ""}</div>
              <div className="formDiv">
                <label htmlFor="email">Email*</label>
                <input
                  type="text"
                  className="inputStyle"
                  id="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={handleChange}
                  autoComplete="on"
                />
                <div className="errorText">
                  {emailError && <p>{emailError}</p>}
                </div>
              </div>
              <div className="formDiv">
                <label htmlFor="pwd">Password*</label>
                <input
                  type="password"
                  className="inputStyle"
                  id="pwd"
                  placeholder="8+ characters"
                  value={password}
                  onChange={handleChange}
                  autoComplete="on"
                />
                <div className="errorText">
                  {passwordError && <p>{passwordError}</p>}
                </div>
              </div>
              {apiName.current === "member" ? (
                <div className="formDiv">
                  <label htmlFor="teamCode">Team Code*</label>
                  <input
                    type="text"
                    className="inputStyle"
                    id="teamCode"
                    placeholder="10 characters"
                    value={teamCode}
                    onChange={handleChange}
                  />
                  <div className="errorText">
                    {teamCodeError && <p>{teamCodeError}</p>}
                  </div>
                </div>
              ) : null}

              <div>
                <button type="submit" className="btnStyle">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
