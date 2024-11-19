import { useState } from "react";
import "../css/AssignTask.css";
import { useLoaderData } from "react-router-dom";
export default function AssignTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadLine, setDeadLine] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const leaderData = useLoaderData();

  function onChangeHandler(event) {
    const id = event.target.id;
    const val = event.target.value;
    switch (id) {
      case "title":
        setTitle(val);
        break;
      case "description":
        setDescription(val);
        break;
      case "deadLine":
        setDeadLine(val);
        break;
      case "assignedTo":
        setAssignedTo(val);
        break;
      default:
        break;
    }
  }

  async function submitHandler(event) {
    event.preventDefault();
    let response;
    try {
      response = await fetch(
        "http://localhost:3000/team-leader/dashboard/assign-task"
      );
      if (!response.ok) {
      }
    } catch (error) {}
  }
  return (
    <>
      <div className="mainBody">
        <div>
          <h3>Assign New Task</h3>
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
