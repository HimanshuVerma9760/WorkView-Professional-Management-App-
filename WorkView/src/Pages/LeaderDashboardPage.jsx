import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "../Components/Auth";
import LogOut from "../Components/LogOut";

export default function LeaderDashboardPage() {
  const navigate = useNavigate();
  const [leaderData, setLeaderData] = useState(null);

  async function verifyToken() {
    try {
      const data = await Auth();
      if (data && data.valid) {
        setLeaderData(data.result);
      } else {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      navigate("/login");
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      verifyToken();
    } else {
      navigate("/login");
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
      {leaderData ? (
        <div>
          <h3>Name: {leaderData.name}</h3>
          <h3>Email: {leaderData.email}</h3>
          <h3>Team Code: {leaderData.teamCode}</h3>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </>
  );
}
