import { useNavigate } from "react-router-dom";

export default function MemberDashboardPage() {

  const navigate=useNavigate();
  function logoutHandler() {
    localStorage.removeItem("token");
    localStorage.removeItem("whichDash");
    navigate('/login');
  }
  return (
    <>
      <h1>Welcome to Member Dashboard</h1>
      <button onClick={logoutHandler}>Log out</button>
    </>
  );
}
