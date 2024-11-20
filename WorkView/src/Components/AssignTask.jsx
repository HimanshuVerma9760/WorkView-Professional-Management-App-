import { useRef, useState } from "react";
import "../css/AssignTask.css";
import { json, useLoaderData, useNavigate } from "react-router-dom";
export default function AssignTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadLine, setDeadLine] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const isValid = useRef(true);

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [deadLineError, setDeadLineError] = useState("");
  const [assignedToError, setAssignedToError] = useState("");
  const [DBError, setDBError] = useState("");

  const navigate = useNavigate();
  const leaderData = useLoaderData();
  console.log(leaderData);

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
      default:
        break;
    }
  }

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
    if (deadLine.trim().length === 0) {
      isValid.current = false;
      setDeadLineError("Must provide a Deadline!");
    }
    if (assignedTo.trim().length === 0) {
      isValid.current = false;
      setAssignedToError("Must Assign the task!");
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
  return (
    <>
      <div className="mainBody">
        <div>
          <h3>Assign New Task</h3>
        </div>
        {console.log("dberror", DBError)}
        <div>{DBError && <p>{DBError}</p>}</div>
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
              value={deadLine}
              onChange={onChangeHandler}
            />
            <div className="errorText">
              {deadLineError && <p>{deadLineError}</p>}
            </div>
          </div>
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
                    <option key={eachTeamMember._id} value={eachTeamMember._id}>
                      {eachTeamMember.name} ({eachTeamMember.email})
                    </option>
                  </>
                ))}
            </select>
            <div className="errorText">
              {assignedToError && <p>{assignedToError}</p>}
            </div>
          </div>
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
