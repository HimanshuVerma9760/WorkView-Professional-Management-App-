import { useNavigate, useLoaderData, Outlet } from "react-router-dom";
import "../css/LeaderDashBoard.css";
export default function LeaderDashboardPage() {
  const navigate = useNavigate();
  const leaderData = useLoaderData();

  console.log(leaderData);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("whichDash");
    navigate("/login");
  };

  return (
    <>
      <div className="content">
        <div className="sideBar">
          <div>
            <h1>Leader Dashboard</h1>
            <button onClick={handleLogout}>Log Out</button>
          </div>
          {leaderData.error === undefined ? (
            <div>
              <h3>Name: {leaderData.name}</h3>
              <h3>Email: {leaderData.email}</h3>
              <h3>Team Code: {leaderData.teamCode}</h3>
              <h3>Team Members: {leaderData.teamMembers.length}</h3>
            </div>
          ) : (
            <p>Loading data...</p>
          )}
        </div>

        <div>
          <Outlet context={leaderData} />
        </div>
      </div>
    </>
  );
}
