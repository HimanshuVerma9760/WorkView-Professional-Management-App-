import { useEffect, useRef, useState } from "react";
import "../css/AssignTask.css";
import { useLoaderData, useNavigate } from "react-router-dom";
import Select from "react-select";

export default function AssignTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadLine, setDeadLine] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [assignmentMode, setAssignmentMode] = useState("Individual");
  const [options, setOptions] = useState("");

  const isValid = useRef(true);

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [deadLineError, setDeadLineError] = useState("");
  const [assignedToError, setAssignedToError] = useState("");
  const [DBError, setDBError] = useState("");

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
    const memberOptions = leaderData.teamMembers.map((member) => ({
      value: member._id,
      label: `${member.name} (${member.email})`,
    }));
    setOptions(memberOptions);
  }, [leaderData]);

  const handleSelectChange = (selectedOptions) => {
    setAssignedTo(selectedOptions.map((option) => option.value));
  };

  useEffect(() => {
    setAssignedTo("");
    setAssignedToError("");
    setDBError("");
    setDeadLine("");
    setDeadLineError("");
    setDescription("");
    setDescriptionError("");
    setTitle("");
    setTitleError("");
    isValid.current = true;
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
    if (deadLine.trim().length === 0) {
      isValid.current = false;
      setDeadLineError("Must provide a Deadline!");
    }
    if (assignedTo.length === 0) {  
      isValid.current = false;
      setAssignedToError("Must Assign the task!");
    }
    if (assignmentMode === "Group") {
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
                      <option
                        key={eachTeamMember._id}
                        value={eachTeamMember._id}
                      >
                        {eachTeamMember.name} ({eachTeamMember.email})
                      </option>
                    ))}
                </select>
                <div className="errorText">
                  {assignedToError && <p>{assignedToError}</p>}
                </div>
              </div>
            </>
          ) : (
            <Select
              className="selectGroup"
              isMulti
              isSearchable
              options={options}
              onChange={handleSelectChange}
              placeholder="Select group members"
            />
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
