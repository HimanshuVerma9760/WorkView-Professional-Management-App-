import { useNavigate, useLoaderData, Outlet } from "react-router-dom";
import "../css/LeaderDashBoard.css";
import { useState } from "react";
import { motion } from "framer-motion";

export default function LeaderDashboardPage() {
  const navigate = useNavigate();
  const leaderData = useLoaderData();
  const [team, setTeam] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("whichDash");
    navigate("/login");
  };
  function showTeamHandler() {
    setTeam((prevState) => !prevState);
  }

  return (
    <>
      <div className="content">
        <div className="sideBar">
          <div>
            <h1>Leader Dashboard</h1>
            <button className="btnStyle" onClick={handleLogout}>
              Log Out
            </button>
          </div>
          {leaderData.error === undefined ? (
            <div className="sideBarDataDiv">
              <h3>Name: {leaderData.name}</h3>
              <h3>Email: {leaderData.email}</h3>
              <h3>Code: {leaderData.teamCode}</h3>
              <h3>
                <motion.button
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  onClick={showTeamHandler}
                  style={{ marginBottom: "1rem" }}
                >
                  Team Members: {leaderData.teamMembers.length}
                </motion.button>
                {team &&
                  leaderData.teamMembers.map((eachMember) => {
                    return (
                      <li key={eachMember._id}>
                        - {eachMember.name}
                        <br />({eachMember.email})
                      </li>
                    );
                  })}
              </h3>
            </div>
          ) : (
            <p>No Team Members!</p>
          )}
        </div>

        <div>
          <Outlet context={leaderData.name} />
        </div>
      </div>
    </>
  );
}
