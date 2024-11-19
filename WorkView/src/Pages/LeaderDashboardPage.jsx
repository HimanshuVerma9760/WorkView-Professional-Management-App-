import { useNavigate, useLoaderData } from "react-router-dom";

export default function LeaderDashboardPage() {
  const navigate = useNavigate();
  const leaderData = useLoaderData();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("whichDash");
    navigate("/login");
  };

  return (
    <>
      <div>
        <h1>Leader Dashboard</h1>
        <button onClick={handleLogout}>Log Out</button>
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
