import { useLoaderData } from "react-router-dom";
import "../css/LeaderDashBoard.css";
import { useState } from "react";
export default function LeaderDashBoard() {
  const leaderData = useLoaderData();
  const [error, setError] = useState(null);
  const [assignedTasks, setAssignedTasks] = useState(leaderData.leader.tasks);

  function deleteState(id) {
    setAssignedTasks((eachTask) => eachTask.filter((task) => task._id !== id));
  }

  async function deleteHandler(taskId, createdBy, assignedTo) {
    deleteState(taskId);
    let response;
    const removalData = {
      taskId,
      createdBy,
      assignedTo,
    };
    try {
      response = await fetch("http://localhost:3000/team-leader/remove-task", {
        method: "post",
        body: JSON.stringify(removalData),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        if (response !== undefined) {
          const res = await response.json();
          console.log("Error occured! while deleting task", res.error);
          setError(res.error);
        } else {
          setError("Something went Wrong!");
        }
      } else {
        console.log("Removal of task successfull!");
      }
    } catch (error) {
      console.log("Unexpected Error occured!", error);
    }
  }
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
            {error && <p>{error}</p>}
            <h2>Assigned Tasks</h2>
            {assignedTasks.length === 0 ? (
              <p>No Tasks Assigned!</p>
            ) : (
              assignedTasks.map((eachTask) => (
                <ol>
                  <li>{eachTask.title}</li>
                  <button
                    onClick={() =>
                      deleteHandler(
                        eachTask._id,
                        eachTask.createdBy,
                        eachTask.assignedTo
                      )
                    }
                  >
                    Remove
                  </button>
                </ol>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
