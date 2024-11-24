import { useEffect, useRef, useState } from "react";
import "../css/AssignTask.css";
import { useLoaderData, useNavigate } from "react-router-dom";
export default function AssignTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadLine, setDeadLine] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [teamNumber, setTeamNumber] = useState("");
  const [assignmentMode, setAssignmentMode] = useState("Individual");
  const [createTeam, setCreateTeam] = useState(false);
  const [teamCount, setTeamCount] = useState(0);

  const isValid = useRef(true);
  const teamcreated = useRef(false);

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [deadLineError, setDeadLineError] = useState("");
  const [assignedToError, setAssignedToError] = useState("");
  const [DBError, setDBError] = useState("");
  const [teamNumberError, setTeamNumberError] = useState("");

  const navigate = useNavigate();
  const leaderData = useLoaderData();

  function onChangeHandler(event) {
    const id = event.target.id;
    const val = event.target.value;
    switch (id) {
      case "title":
        setTitle(val);
        setTitleError("");
        isValid.current = true;
        break;
      case "description":
        setDescription(val);
        setDescriptionError("");
        isValid.current = true;
        break;
      case "deadLine":
        setDeadLine(val);
        setDeadLineError("");
        isValid.current = true;
        break;
      case "assignedTo":
        setAssignedTo(val);
        setAssignedToError("");
        isValid.current = true;
        break;
      case "teamNo":
        if (!(val < 0)) {
          setTeamNumber(val);
          setTeamNumberError("");
          isValid.current = true;
        }
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    setAssignedTo("");
    setAssignedToError("");
    setDBError("");
    setDeadLine("");
    setDeadLineError("");
    setDescription("");
    setDescriptionError("");
    setTeamNumber("");
    setTeamNumberError("");
    setTitle("");
    setTitleError("");
    setCreateTeam(false);
    isValid.current = true;
    teamcreated.current = false;
  }, [assignmentMode]);

  async function submitHandler(event) {
    event.preventDefault();
    if (title.trim().length < 3) {
      isValid.current = false;
      setTitleError("Invalid Title! length must be atleast 3");
    }
    if (description.trim().length < 15) {
      isValid.current = false;
      setDescriptionError("Invalid Description! length must be atleast 15");
    }
    if (deadLine.trim().length === 0 || !isValid.current) {
      isValid.current = false;
      setDeadLineError("Must provide a Deadline!");
    }
    if (assignedTo.trim().length === 0) {
      isValid.current = false;
      setAssignedToError("Must Assign the task!");
    }
    if (
      isNaN(teamNumber) ||
      teamNumber === "" ||
      teamNumber === null ||
      teamNumber === undefined ||
      teamNumber > leaderData.teamMembers.length
    ) {
      isValid.current = false;
      if (teamNumber > leaderData.teamMembers.length) {
        setTeamNumberError(
          `Invalid Group Size, you have only ${leaderData.teamMembers.length} team-members!`
        );
      } else if (teamcreated.current === false) {
        setTeamNumberError("Must create a Group before assigning task");
      } else {
        setTeamNumberError("Invalid input!");
      }
    }

    if (isValid.current) {
      if (localStorage.getItem("token") && localStorage.getItem("whichDash")) {
        const taskFormData = {
          title,
          description,
          deadLine,
          assignedTo,
          createdBy: leaderData._id,
        };
        let response;
        try {
          response = await fetch(
            "http://localhost:3000/team-leader/dashboard/assign-task",
            {
              method: "post",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify(taskFormData),
            }
          );
          if (!response.ok) {
            const res = await response.json();
            console.log("error in response!", res);
            const error = res.error;
            setDBError(error);
          } else {
            console.log("saved task Successfully!");
            navigate("/team-leader/dashboard");
          }
        } catch (error) {
          console.log("error!!", error);
          return new Error(error);
        }
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("whichDash");
        navigate("/login");
      }
    }
  }

  function dateCheck(event) {
    const todayDate = Date.now();
    const setDate = Date.parse(event.target.value);
    if (isNaN(setDate)) {
      isValid.current = false;
      setDeadLineError("Invalid Date!");
    } else if (setDate - todayDate < 0) {
      isValid.current = false;
      setDeadLineError("The deadline date cannot be earlier than today!");
    } else {
      isValid.current = true;
      setDeadLineError("");
    }
  }

  function assignmentModeHandler() {
    setAssignmentMode((prevMode) => {
      if (prevMode === "Individual") {
        return "Group";
      } else {
        return "Individual";
      }
    });
  }

  function createTeamHandler() {
    if (teamNumber === "") {
      setTeamNumberError("Invalid input!");
    } else if (teamNumber > leaderData.teamMembers.length) {
      setTeamNumberError(
        `Invalid input! you have only ${leaderData.teamMembers.length} members in your team`
      );
    } else {
      setCreateTeam(true);
      teamcreated.current = true;
      setTeamCount(teamNumber);
    }
  }

  return (
    <>
      <div className="mainBody">
        <div className="btnDiv">
          <div>
            <button
              className={`${assignmentMode === "Individual" ? "_active" : ""}`}
              onClick={assignmentModeHandler}
            >
              Individual Assignment
            </button>
          </div>
          <div>
            <button
              className={`${assignmentMode === "Group" ? "_active" : ""}`}
              onClick={assignmentModeHandler}
            >
              Group Assignment
            </button>
          </div>
        </div>
        <div>
          <h3>Assigning {assignmentMode} Task</h3>
          <div className="errorText">{DBError && <p>{DBError}</p>}</div>
        </div>
        <form onSubmit={(event) => submitHandler(event)}>
          <div className="formDiv">
            <label htmlFor="title">Title</label>
            <input
              className="inputStyle"
              id="title"
              placeholder="Enter Title"
              type="text"
              onChange={onChangeHandler}
              value={title}
            />
            <div className="errorText">{titleError && <p>{titleError}</p>}</div>
          </div>
          <div className="formDiv">
            <label htmlFor="description">Description</label>
            <textarea
              rows={5}
              className="inputStyle"
              id="description"
              type="text"
              placeholder="Enter Description"
              onChange={onChangeHandler}
              value={description}
            />
            <div className="errorText">
              {descriptionError && <p>{descriptionError}</p>}
            </div>
          </div>
          <div className="formDiv">
            <label htmlFor="deadLine">DeadLine</label>
            <input
              className="inputStyle"
              id="deadLine"
              type="Date"
              onBlur={(event) => dateCheck(event)}
              value={deadLine}
              onChange={onChangeHandler}
            />
            <div className="errorText">
              {deadLineError && <p>{deadLineError}</p>}
            </div>
          </div>
          {assignmentMode === "Individual" ? (
            <>
              <div className="formDiv">
                <label htmlFor="assignedTo">Assign to</label>

                <select
                  className="inputStyle"
                  id="assignedTo"
                  type="text"
                  value={assignedTo}
                  onChange={onChangeHandler}
                >
                  <option key={0} value="" disabled>
                    Select from the following
                  </option>
                  {leaderData &&
                    leaderData.teamMembers.map((eachTeamMember) => (
                      <>
                        <option
                          key={eachTeamMember._id}
                          value={eachTeamMember._id}
                        >
                          {eachTeamMember.name} ({eachTeamMember.email})
                        </option>
                      </>
                    ))}
                </select>
                <div className="errorText">
                  {assignedToError && <p>{assignedToError}</p>}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="formDiv">
                <label htmlFor="members">Number of Group Members</label>
                <section className="createMembersDiv">
                  <input
                    type="number"
                    placeholder="Max 2"
                    className="inputStyle"
                    id="teamNo"
                    value={teamNumber}
                    onChange={onChangeHandler}
                  />
                  <button
                    onClick={createTeamHandler}
                    type="button"
                    className="btn"
                  >
                    Create
                  </button>
                </section>
                <div className="errorText">
                  {teamNumberError && <p>{teamNumberError}</p>}
                </div>
              </div>
            </>
          )}
          <div type="submit">
            <button className="btnStyle" type="submit">
              Assign Task
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
