import { useOutletContext } from "react-router-dom";
import "../css/LeaderDashBoard.css";
export default function LeaderDashBoard() {
  const leaderData = useOutletContext();
  return (
    <>
      <div className="mainDashboard">
        <div>
          <div>
            <h1>Hello</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Repellendus nihil numquam, ducimus consectetur doloremque tempore
              vitae eveniet. Iure, inventore corporis in doloremque magni quo
              exercitationem odio, aut dolorum commodi iusto!
            </p>
          </div>
          <div>
            <h2>Assigned Tasks</h2>
            {leaderData.tasks.length === 0 ? (
              <p>No Tasks Assigned!</p>
            ) : (
              leaderData.tasks.map((eachTask) => (
                <ol>
                  <li>{eachTask.name}</li>
                </ol>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
