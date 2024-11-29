import { useLoaderData, useNavigate } from "react-router-dom";
import "../css/LeaderDashBoard.css";

export default function MemberDashboardPage() {
  const navigate = useNavigate();
  const memberData = useLoaderData();

  function logoutHandler() {
    localStorage.removeItem("token");
    localStorage.removeItem("whichDash");
    navigate("/login");
  }
  return (
    <>
      <div className="content">
        <div className="sideBar">
          <div>
            <h1>Member Dashboard</h1>
            <button className="btnStyle" onClick={logoutHandler}>
              Log Out
            </button>
          </div>
          {memberData.error === undefined ? (
            <div className="sideBarDataDiv">
              <h3>Name: {memberData.name}</h3>
              <h3>Email: {memberData.email}</h3>
              <h3>Code: {memberData.teamCode}</h3>
            </div>
          ) : (
            <p>No Team Members!</p>
          )}
        </div>
      </div>
    </>
  );
}
