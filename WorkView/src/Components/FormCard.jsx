import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
export default function FormCard() {
  let apiName = useRef("team-leader");
  const formDiv = {
    display: "flex",
    flexDirection: "column",
  };
  const inputStyle = {
    minHeight: "3rem",
    border: "2px solid rgb(213, 210, 210)",
    borderRadius: "5px",
    padding: "10px",
  };
  const btnStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "3rem",
    color: "white",
    backgroundColor: "rgb(90, 137, 90)",
    border: "none",
    borderRadius: "5px",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [error, setError] = useState(false);
  const [dbError, setDbError] = useState("");

  const [nameError, setNameError] = useState("");
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
    setName("");
    setNameError("");
    setPassword("");
    setPasswordError("");
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
        console.log("Error", error);
      }
      if (!response || !response.ok) {
        const errorData = await response.json();
        setError(true);
        setDbError(errorData.error);
        console.log("Error Occurred! while creating new user");
      } else {
        navigate("/login");
      }
      setEmail("");
      setName("");
      setPassword("");
      setTeamCode("");
    } else {
      console.log("invalid");
    }
  }

  return (
    <>
      <form method="post" onSubmit={handleSubmit}>
        <div style={{ marginTop: "5rem" }}>
          <div style={{ color: "red", textAlign: "center" }}>
            {error ? dbError : ""}
          </div>
          <div style={formDiv}>
            <label htmlFor="name">Name*</label>
            <input
              type="text"
              style={inputStyle}
              id="name"
              placeholder="full name"
              value={name}
              onChange={handleChange}
              autoComplete="on"
            />
            <div style={{ fontSize: "1rem", marginBottom: "2px" }}>
              {nameError && <p style={{ color: "red" }}>{nameError}</p>}
            </div>
          </div>
          <div style={formDiv}>
            <label htmlFor="email">Email*</label>
            <input
              type="text"
              style={inputStyle}
              id="email"
              placeholder="example@email.com"
              value={email}
              onChange={handleChange}
              autoComplete="on"
            />
            <div style={{ fontSize: "1rem", marginBottom: "2px" }}>
              {emailError && <p style={{ color: "red" }}>{emailError}</p>}
            </div>
          </div>
          <div style={formDiv}>
            <label htmlFor="pwd">Password*</label>
            <input
              type="password"
              style={inputStyle}
              id="pwd"
              placeholder="8+ characters"
              value={password}
              onChange={handleChange}
              autoComplete="on"
            />
            <div style={{ fontSize: "1rem", marginBottom: "2px" }}>
              {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
            </div>
          </div>
          {apiName.current === "member" ? (
            <div style={formDiv}>
              <label htmlFor="teamCode">Team Code*</label>
              <input
                type="text"
                style={inputStyle}
                id="teamCode"
                placeholder="10 characters"
                value={teamCode}
                onChange={handleChange}
                autoComplete="on"
              />
              <div style={{ fontSize: "1rem", marginBottom: "2px" }}>
                {teamCodeError && (
                  <p style={{ color: "red" }}>{teamCodeError}</p>
                )}
              </div>
            </div>
          ) : (
            ""
          )}

          <div>
            <button type="submit" style={btnStyle}>
              Submit
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
