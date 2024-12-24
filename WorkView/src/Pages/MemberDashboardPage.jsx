import { useLoaderData, useNavigate, Link } from "react-router-dom";
import { useState, useRef } from "react";
import "../css/LeaderDashBoard.css";
import { motion } from "framer-motion";

export default function MemberDashboardPage() {
  const navigate = useNavigate();
  const memberData = useLoaderData();

  // console.log(memberData);
  const [error, setError] = useState(null);
  // const [showNotesFor, setShowNotesFor] = useState(null);
  const [showGroupFor, setShowGroupFor] = useState(null);
  const [showDeadLineFor, setShowDeadLineFor] = useState(null);
  const [sortedSelectValue, setSortedSelectValue] = useState("All Tasks");
  const [hasStarted, setHasStarted] = useState(false);
  const [assignedTasks, setAssignedTasks] = useState(memberData.tasks);
  const initial = { opacity: 0, y: -50 };
  const final = { opacity: 1, y: 0 };

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

  // function progressHandler(id) {
  //   setHasStarted(true);
  //   console.log(id);
  // }
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
      <div className="mainDashboard">
        <motion.div
          initial={initial}
          animate={final}
          transition={{ duration: 0.7 }}
        >
          <div>
            <h1>Hello, {memberData.name.split(" ")[0]}!</h1>
            <p>
              Welcome to your dashboard! Here, you can track your assigned
              tasks, stay updated on team progress, and contribute to shared
              goals effectively. Use this space to collaborate seamlessly, stay
              organized, and ensure your efforts drive the team's success.
              <br /> Let’s work together to make today productive and impactful!
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
                  const { datePart, timePart } = convertToIST(
                    eachTask.createdAt
                  );
                  return (
                    <ol className="taskCard">
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
                              <h3 key={Math.random()}>
                                @
                                {member.email === memberData.email
                                  ? "You"
                                  : member.name}
                              </h3>
                            ))}
                          </li>
                        )}
                      {/* {showNotesFor === eachTask._id && (
                        <li>
                          <p>
                            {eachTask.notes.trim().length === 0
                              ? "No Updates yet!"
                              : eachTask.notes}
                          </p>
                        </li>
                      )} */}
                      <li className="deadLine">
                        <p>
                          {Date.parse(eachTask.deadline) >= Date.now() ? (
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
                      {/* <div className="tasksBtn"> */}
                        {/* <button
                          className="btnStyleTasks"
                          disabled={hasStarted}
                          onClick={() => progressHandler(eachTask._id)}
                        >
                         {!hasStarted?"Start":"Accepted"}
                        </button> */}

                        {/* <button
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
                        </button> */}
                      {/* </div> */}
                    </ol>
                  );
                }
              })
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
