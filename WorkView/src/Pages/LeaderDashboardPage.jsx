import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LeaderDashboardPage() {
  const navigate = useNavigate();
  const [leaderName, setLeaderName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [leaderTeamCode, setLeaderTeamCode] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetch("http://localhost:3000/team-leader/dashboard", {
        method: "get",
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
        .then(async (response) => {
          if (!response.ok) {
            console.log("Invalid Token!");
            navigate("/login");
          } else {
            return response.json();
          }
        })
        .then((data) => {
          console.log("data", data);
          const name = data.name;
          const email = data.email;
          const teamCode = data.teamCode;
          setLeaderName(name);
          setLeaderEmail(email);
          setLeaderTeamCode(teamCode);
        });
    }
  }, [navigate]);

  return (
    <>
      <div>
        <h1>Leader Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Log Out
        </button>
      </div>
      <div>
        <h3>Name: {leaderName}</h3>
        <h3>email: {leaderEmail}</h3>
        <h3>Team Code: {leaderTeamCode}</h3>
      </div>
    </>
  );
}
