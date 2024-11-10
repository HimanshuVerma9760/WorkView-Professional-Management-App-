import { Link } from "react-router-dom";
import "../css/Home.css";

export default function HomePage() {
  const homeHead = {
    display: "flex",
    justifyContent: "center",
    fontSize: "25px",
    textAlign: "center",
    paddingLeft: "25%",
    paddingRight: "25%",
  };
  const homeDetail = {
    display: "flex",
    flexDirection: "row",
    gap: "2rem",
    fontSize: "15px",
  };
  return (
    <>
      <main>
        <div style={{ textAlign: "Left", margin: "auto", fontSize: "2rem" }}>
          <h1>One tool for doing it all, together</h1>
          <h3>Work View is the task management tool for Professionals</h3>
          <div className="navs">
            <div className="nav-link">
              <Link to="/sign-up">Sign up</Link>
            </div>
            <div className="nav-link">
              <Link to="/login">Log in</Link>
            </div>
          </div>
        </div>
        <div style={{ margin: "auto" }}>
          <img src="workView.webp" />
        </div>
      </main>

      <div className="detail-section">
        <div style={homeHead}>
          <h1>Make work more transparent, efficient, and accounted for</h1>
        </div>
        <div style={homeDetail}>
          <div>
            <h2>Everyone is always in the loop</h2>
            <p>
              Easily searchable and organized tasks mean everyone stays
              up-to-date on what matters
            </p>
          </div>
          <div>
            <h2>Analyze workflows for inefficiencies</h2>
            <p>
              Documenting your workflow and following tasks through each stage
              means more insights for streamlining.
            </p>
          </div>
          <div>
            <h2>Create accountability when collaborating</h2>
            <p>
              Assign each issue to a team member, so tasks always have someone
              responsible for moving them forward.
            </p>
          </div>
          <div>
            <h2>Easily sort and prioritize work</h2>
            <p>
              With robust search and filters, you can see all unresolved issues
              and quickly prioritize what matters most.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
