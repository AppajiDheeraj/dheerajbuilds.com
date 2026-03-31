import "./FieldworkRoutine.css";
import { useRef } from "react";
import { Github } from "lucide-react";

import projects from "../../data/projects";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FieldworkRoutine = () => {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1000px)", () => {
        const section = sectionRef.current;
        const stage = stageRef.current;
        const track = trackRef.current;

        if (!section || !stage || !track) return;

        const getDistance = () => Math.max(0, track.scrollWidth - stage.clientWidth);
        const getEndDistance = () =>
          Math.max(getDistance() + window.innerHeight * 0.35, window.innerHeight * 0.8);

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getEndDistance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          if (tween.scrollTrigger) {
            tween.scrollTrigger.kill();
          }
          tween.kill();
        };
      });

      mm.add("(max-width: 999px)", () => {
        if (trackRef.current) {
          gsap.set(trackRef.current, { clearProps: "transform" });
        }
      });

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section className="fieldwork-routine" ref={sectionRef}>
      <div className="fieldwork-routine-header">
        <p className="primary sm">Creation Flow</p>
        <h2>Cool Stuff</h2>
      </div>

      <div className="fieldwork-routine-stage" ref={stageRef}>
        <div className="fieldwork-routine-track" ref={trackRef}>
          {projects.map((project, index) => (
            <article className="fieldwork-card" key={project.id}>
              <div className="fieldwork-card-image">
                <img src={project.image} alt={project.title} loading="lazy" />
              </div>

              <div className="fieldwork-card-copy">
                <div className="fieldwork-card-top">
                  <span>{`${String(index + 1).padStart(2, "0")} / ${String(
                    projects.length
                  ).padStart(2, "0")}`}</span>
                </div>

                <h3>{project.title}</h3>
                <p>{project.description}</p>

                <a
                  className="fieldwork-card-link"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={14} strokeWidth={2.25} aria-hidden="true" />
                  View on GitHub
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FieldworkRoutine;