import { Link, useLoaderData } from "react-router-dom";
import "../css/LeaderDashBoard.css";
import { useState } from "react";

export default function LeaderDashBoard() {
  const leaderData = useLoaderData();

  const [error, setError] = useState(null);
  const [showNotesFor, setShowNotesFor] = useState(null);
  const [showGroupFor, setShowGroupFor] = useState(null);
  const [assignedTasks, setAssignedTasks] = useState(leaderData.tasks);

  function convertToIST(dateString) {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    const datePart = date.toLocaleDateString("en-CA", options);
    const timePart = date.toLocaleTimeString("en-GB", {
      hour12: true,
    });
    return { datePart, timePart };
  }

  function deleteState(id) {
    setAssignedTasks((eachTask) => eachTask.filter((task) => task._id !== id));
  }

  async function deleteHandler(taskId, createdBy, assignedTo) {
    deleteState(taskId);
    const newAssignTo = assignedTo.map((eachAssign) => eachAssign._id);
    // console.log(newAssignTo);
    const removalData = {
      taskId,
      createdBy,
      assignedTo: newAssignTo,
    };

    try {
      const response = await fetch(
        "http://localhost:3000/team-leader/remove-task",
        {
          method: "post",
          body: JSON.stringify(removalData),
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        const res = await response.json();
        console.error("Error occurred while deleting task", res.error);
        setError(res.error);
      } else {
        console.log("Task removed successfully!");
      }
    } catch (error) {
      console.error("Unexpected error occurred!", error);
      setError("Something went wrong while deleting the task.");
    }
  }

  function progressHandler(id) {
    setShowNotesFor((prevId) => (prevId === id ? null : id));
  }
  function handleShowGroup(e, id) {
    e.preventDefault();
    // setShowGroup((prevState) => !prevState);
    setShowGroupFor((prevId) => (prevId === id ? null : id));
  }

  return (
    <div className="mainDashboard">
      <div>
        <div>
          <h1>Hello</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus
            nihil numquam, ducimus consectetur doloremque tempore vitae eveniet.
            Iure, inventore corporis in doloremque magni quo exercitationem
            odio, aut dolorum commodi iusto!
          </p>
        </div>
        {error && <p>{error}</p>}
        <h2>Assigned Tasks</h2>
        <div className="tasks">
          {assignedTasks.length === 0 ? (
            <p>No Tasks Assigned!</p>
          ) : (
            assignedTasks.map((eachTask) => {
              const { datePart, timePart } = convertToIST(eachTask.createdAt);
              return (
                <ol key={eachTask._id} className="taskCard">
                  <li>
                    <p>
                      {datePart} at {timePart}
                    </p>
                  </li>
                  <li className="taskTitle">
                    <h3>{eachTask.title}</h3>
                  </li>
                  {eachTask.assignedTo.length > 1 ? (
                    <div className="showGroupLinkDiv">
                      <Link
                        className="showGroupLink"
                        onClick={(e) => handleShowGroup(e, eachTask._id)}
                      >
                        {showGroupFor === eachTask._id ? "Hide" : "Show"} Group
                      </Link>
                    </div>
                  ) : (
                    <h3>@{eachTask.assignedTo[0].name}</h3>
                  )}
                  {showGroupFor === eachTask._id &&
                    eachTask.assignedTo.length > 1 && (
                      <li className="assignedTo">
                        {eachTask.assignedTo.map((member) => (
                          <h3 key={Math.random()}>@{member.name}</h3>
                        ))}
                      </li>
                    )}
                  {showNotesFor === eachTask._id && (
                    <li>
                      <p>
                        {eachTask.notes.trim().length === 0
                          ? "No Updates yet!"
                          : eachTask.notes}
                      </p>
                    </li>
                  )}
                  <li className="deadLine">
                    <p>
                      {`${Math.floor(
                        (Date.parse(eachTask.deadline) - Date.now()) /
                          (3600 * 1000)
                      )} hrs left - (${eachTask.status})`}
                    </p>
                  </li>
                  <div className="tasksBtn">
                    <button
                      className="btnStyleTasks"
                      onClick={() => progressHandler(eachTask._id)}
                    >
                      Progress
                    </button>

                    <button
                      className="btnStyleTasks"
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
                  </div>
                </ol>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
