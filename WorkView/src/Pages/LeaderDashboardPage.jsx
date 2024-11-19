import { useNavigate, useLoaderData } from "react-router-dom";
import "../css/leaderDashBoard.css";

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
      <div className="content">
        <div className="sideBar">
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
        </div>
        <div>
          <h1>Hello</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus
            nihil numquam, ducimus consectetur doloremque tempore vitae eveniet.
            Iure, inventore corporis in doloremque magni quo exercitationem
            odio, aut dolorum commodi iusto!
          </p>
        </div>
      </div>
    </>
  );
}
