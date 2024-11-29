import { Link, useLoaderData, useOutletContext } from "react-router-dom";
import "../css/LeaderDashBoard.css";
import { useRef, useState } from "react";

export default function LeaderDashBoard() {
  const leaderData = useLoaderData();
  const leaderName = useOutletContext();
  const [error, setError] = useState(null);
  const [showNotesFor, setShowNotesFor] = useState(null);
  const [showGroupFor, setShowGroupFor] = useState(null);
  const [showDeadLineFor, setShowDeadLineFor] = useState(null);
  const [sortedSelectValue, setSortedSelectValue] = useState("All Tasks");
  const [assignedTasks, setAssignedTasks] = useState(leaderData.tasks);

  const setAllTasksFilter = useRef(true);

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
    setShowGroupFor((prevId) => (prevId === id ? null : id));
  }

  function showDeadLineHandler(e, id) {
    e.preventDefault();
    setShowDeadLineFor((prevId) => (prevId === id ? null : id));
  }

  function onChangeHandler(event) {
    console.log(event.target.value);
    setSortedSelectValue(event.target.value);
  }

  return (
    <div className="mainDashboard">
      <div>
        <div>
          <h1>Hello, {leaderName.split(" ")[0]}!</h1>
          <p>
            Welcome to your dashboard. This is your command center for tracking
            team progress, managing tasks, and driving productivity.
            <br /> Stay on top of your team's achievements and streamline your
            workflows with ease. Let's make today productive!
          </p>
        </div>
        {error && <p>{error}</p>}
        <div className="tasksHeadSelect">
          <h2>Assigned Tasks</h2>
          <select defaultValue="All Tasks" onChange={onChangeHandler}>
            <option value="All Tasks">All Tasks</option>
            <option value="Pending">Pending Tasks</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed Tasks</option>
            <option value="Not Completed">Not Completed</option>
          </select>
        </div>
        <div className="tasks">
          {assignedTasks.length === 0 ? (
            <p>No Tasks Assigned!</p>
          ) : (
            assignedTasks.map((eachTask) => {
              setAllTasksFilter.current =
                sortedSelectValue === "All Tasks" ? true : false;
              if (
                eachTask.status === sortedSelectValue ||
                setAllTasksFilter.current
              ) {
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
                          {showGroupFor === eachTask._id ? "Hide" : "Show"}{" "}
                          Group
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
                        {Date.parse(eachTask.deadline) > Date.now() ? (
                          `${Math.floor(
                            (Date.parse(eachTask.deadline) - Date.now()) /
                              (3600 * 1000)
                          )} hrs left - (${eachTask.status})`
                        ) : (
                          <Link
                            className="deadlineLink"
                            onClick={(e) =>
                              showDeadLineHandler(e, eachTask._id)
                            }
                          >
                            {eachTask.status} - (DeadLine)
                          </Link>
                        )}
                      </p>
                      {showDeadLineFor === eachTask._id && (
                        <li>
                          <p>{convertToIST(eachTask.deadline).datePart}</p>
                        </li>
                      )}
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
              }
            })
          )}
        </div>
      </div>
    </div>
  );
}
