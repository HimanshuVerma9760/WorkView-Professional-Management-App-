import { Link } from "react-router-dom";
import "../css/Home.css";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <main>
          <div className="intro-section">
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
          <div className="image-section">
            <img src="workView.webp" alt="WorkView illustration" />
          </div>
        </main>

        <div className="detail-section">
          <div className="home-head">
            <h1>Make work more transparent, efficient, and accounted for</h1>
          </div>
          <div className="home-detail">
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
                With robust search and filters, you can see all unresolved
                issues and quickly prioritize what matters most.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
