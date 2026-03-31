import projects from "../../data/projects";
import React, { useState } from "react";
import "./Work.css";
import { Github } from "lucide-react";

import Transition from "../../components/Transition/Transition";

const Work = () => {
  const [activeProject, setActiveProject] = useState(projects[0]);

  return (
    <div className="page work">
      <div className="work-carousel">
        <div className="work-slider-img">
          <img src={activeProject.image} alt={activeProject.title} />
        </div>

        <aside className="work-details-panel">
          <p className="primary sm">Selected Project</p>
          <h2>{activeProject.title}</h2>
          <p className="secondary">{activeProject.description}</p>
          <a
            className="work-github-cta"
            href={activeProject.githubUrl}
            target="_blank"
            rel="noreferrer"
          >
              <Github size={16} strokeWidth={2.25} aria-hidden="true" />
            View on GitHub
          </a>
        </aside>

        <div className="work-items-preview-container">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`work-item ${
                activeProject.id === project.id ? "active" : ""
              }`}
              onClick={() => setActiveProject(project)}
            >
              <img src={project.image} alt={project.title} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transition(Work);
