import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import CryptoJs from "crypto-js";
import "../css/LoginPage.css";
import "../css/FormCard.css";
import { motion } from "framer-motion";
const backendAPI=import.meta.env.VITE_BACKEND_API;

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
    setError(false);
    setPassword("");
    setPasswordError("");
    setTeamCode("");
    setTeamCodeError("");
    const token = localStorage.getItem("token");
    function checkLogin() {
      if (token && localStorage.getItem("whichDash")) {
        const decryptedData = CryptoJs.AES.decrypt(
          localStorage.getItem("whichDash"),
          token
        ).toString(CryptoJs.enc.Utf8);
        if (decryptedData === "team-leader" || decryptedData === "member") {
          navigate(`/${decryptedData}/dashboard`);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("whichDash");
        }
      } else {
        setDbError("");
        setError(false);
      }
    }
    checkLogin();
  }, [location.pathname, apiName.current]);

  if (location.pathname === "/member-login") {
    apiName.current = "member";
  } else if (location.pathname === "/login") {
    apiName.current = "team-leader";
  }

  function handleChange(event) {
    if (localStorage.getItem("token")) {
      return;
    }
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
    if (error) {
      return;
    }
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
        console.log("req is sent");
        response = await fetch(
          `${backendAPI}/${apiName.current}/api-login-${apiName.current}`,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
      } catch (error) {
        console.log("catch block error!!");
        setError(true);
        setDbError(error);
      }
      if (!response || !response.ok) {
        console.log("response error");
        setError(true);
        if (response !== undefined) {
          try {
            const errorData = await response.json();
            setDbError(errorData.error);
          } catch (error) {
            setDbError(response.statusText);
          }
        } else {
          console.log("db error");
          setDbError("Sorry! Try Again Later");
        }
      } else {
        console.log("token is set");
        const res = await response.json();
        const token = res.token;
        localStorage.setItem("token", token);
        const encryptedData = CryptoJs.AES.encrypt(
          apiName.current,
          token
        ).toString();
        localStorage.setItem("whichDash", encryptedData);
        navigate(`/${apiName.current}/dashboard`);
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
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="mainHead">
          <h1>Log in to your WorkView Account</h1>
          <h2>Professional's Personal Tab</h2>
        </div>
        <div className="mainForm">
          <div style={{ textAlign: "center" }}>
            <h3>
              Login or <Link to="/sign-up">Create an account</Link>
            </h3>
            <div className="navClicks">
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
            <div className="errorContainer">{error ? dbError : ""}</div>
            <div style={{ marginTop: "5rem" }}>
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
      </motion.div>
    </>
  );
}
