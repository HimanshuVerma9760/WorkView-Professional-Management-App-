import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/FormCard.css";

export default function FormCard() {
  const apiName = useRef("team-leader");
  const confirmPassRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [error, setError] = useState(false);
  const [dbError, setDbError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [teamCodeError, setTeamCodeError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setDbError("");
    setEmail("");
    setEmailError("");
    setError("");
    setName("");
    setNameError("");
    setPassword("");
    setPasswordError("");
    setConfirmPassword("");
    setConfirmPasswordError("");
    setTeamCode("");
    setTeamCodeError("");
  }, [apiName.current]);

  if (location.pathname === "/member-sign-up") {
    apiName.current = "member";
  } else if (location.pathname === "/sign-up") {
    apiName.current = "team-leader";
  }

  function handleChange(event) {
    setError(false);
    const key = event.target.id;
    const value = event.target.value;
    switch (key) {
      case "name":
        setNameError("");
        setName(value);
        break;
      case "email":
        setEmailError("");
        setEmail(value);
        break;
      case "pwd":
        setPasswordError("");
        setPassword(value);
        break;
      case "confirmPwd":
        if (password.trim().length >= 8) {
          setConfirmPasswordError("");
          setConfirmPassword(value);
        } else {
          confirmPassRef.current.focus();
          setConfirmPasswordError("You must enter a valid password first");
          setPasswordError("");
        }
        break;
      case "teamCode":
        setTeamCodeError("");
        setTeamCode(value);
        break;
      default:
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    let valid = true;

    if (name.length < 3) {
      setNameError("Name must be at least 3 characters");
      valid = false;
    } else {
      setNameError("");
    }

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
    if (password === confirmPassword) {
      setConfirmPasswordError("");
    } else {
      setConfirmPasswordError("Passwords do not match");
      valid = false;
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
          leaderName: name,
          leaderEmail: email,
          leaderPassword: password,
        };
      } else {
        formData = {
          memberName: name,
          memberEmail: email,
          memberPassword: password,
          teamCode: teamCode,
        };
      }
      let response;
      try {
        response = await fetch(
          `http://localhost:3000/${apiName.current}/api-create-${apiName.current}`,
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
      setName("");
      setPassword("");
      setTeamCode("");
      setConfirmPassword("");
      setConfirmPasswordError("");
    } else {
      console.log("invalid");
    }
  }

  return (
    <>
      <form method="post" onSubmit={handleSubmit}>
        <div style={{ marginTop: "5rem" }}>
          <div className="errorContainer">{error ? dbError : ""}</div>
          <div className="formDiv">
            <label htmlFor="name">Name*</label>
            <input
              type="text"
              className="inputStyle"
              id="name"
              placeholder="full name"
              value={name}
              onChange={handleChange}
              autoComplete="on"
            />
            <div className="errorText">{nameError && <p>{nameError}</p>}</div>
          </div>
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
            <div className="errorText">{emailError && <p>{emailError}</p>}</div>
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
              ref={confirmPassRef}
              autoComplete="on"
            />
            <div className="errorText">
              {passwordError && <p>{passwordError}</p>}
            </div>
          </div>
          <div className="formDiv">
            <label htmlFor="confirmPwd">Confirm Password*</label>
            <input
              type="password"
              className="inputStyle"
              id="confirmPwd"
              placeholder="8+ characters"
              value={confirmPassword}
              onChange={handleChange}
              autoComplete="on"
            />
            <div className="errorText">
              {confirmPasswordError && <p>{confirmPasswordError}</p>}
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
    </>
  );
}
