import React, { useEffect, useMemo, useRef } from "react";
import "./About.css";

import ContactForm from "../../components/ContactForm/ContactForm";
import Footer from "../../components/Footer/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Matter from "matter-js";

import ReactLenis from "lenis/react";
import Transition from "../../components/Transition/Transition";
import AboutResizeHero from "../../components/AboutResizeHero/AboutResizeHero";

gsap.registerPlugin(ScrollTrigger);

const ABOUT_PARAGRAPHS = [
  "Welcome to the corner of the internet where things get built, not just for the scroll, but for the story. This is not just a site. Its a working archive of experiments, learnings, and quiet flexes.",
  "I am Appaji Dheeraj. I design with rhythm, build with care, and believe every detail deserves a reason to exist. From quick sketches to final deploy, everything here was made with intent and maybe a bit of caffeine. This space is built for motion, meaning, and messing around until it clicks.",
];

const KEYWORDS = new Set([
  "corner",
  "scroll",
  "archive",
  "learnings",
  "rhythm",
  "detail",
  "deploy",
  "caffeine",
  "messing",
]);

const GALLERY_CARDS = [
  { id: "X01-842", image: "/project/project-1.jpg" },
  { id: "V9-372K", image: "/project/project-2.jpg" },
  { id: "Z84-Q17", image: "/project/project-3.jpg" },
  { id: "L56-904", image: "/project/project-4.jpg" },
  { id: "A23-7P1", image: "/project/project-5.jpg" },
  { id: "T98-462", image: "/reviews/review-1.jpg" },
];

const About = () => {
  const animeSectionRef = useRef(null);
  const skillsSectionRef = useRef(null);
  const objectContainerRef = useRef(null);
  const stickyCardsSectionRef = useRef(null);
  const galleryCardRefs = useRef([]);

  const paragraphWords = useMemo(() => {
    return ABOUT_PARAGRAPHS.map((paragraph) =>
      paragraph.split(/\s+/).map((word) => {
        const normalizedWord = word.toLowerCase().replace(/[.,!?;:"]/g, "");
        return {
          word,
          normalizedWord,
          isKeyword: KEYWORDS.has(normalizedWord),
        };
      })
    );
  }, []);

  useEffect(() => {
    const triggers = [];
    const intervals = [];
    const timers = [];
    let rafId = null;
    let engine = null;
    let runner = null;
    let physicsStarted = false;
    let bodyBindings = [];

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    const initPhysics = () => {
      if (physicsStarted || !objectContainerRef.current) return;
      physicsStarted = true;

      const container = objectContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const wallThickness = 200;
      const floorOffset = 8;

      engine = Matter.Engine.create();
      engine.gravity = { x: 0, y: 1 };
      engine.constraintIterations = 15;
      engine.positionIterations = 25;
      engine.velocityIterations = 20;

      const walls = [
        Matter.Bodies.rectangle(
          containerRect.width / 2,
          containerRect.height - floorOffset + wallThickness / 2,
          containerRect.width + wallThickness * 2,
          wallThickness,
          { isStatic: true }
        ),
        Matter.Bodies.rectangle(
          -wallThickness / 2,
          containerRect.height / 2,
          wallThickness,
          containerRect.height + wallThickness * 2,
          { isStatic: true }
        ),
        Matter.Bodies.rectangle(
          containerRect.width + wallThickness / 2,
          containerRect.height / 2,
          wallThickness,
          containerRect.height + wallThickness * 2,
          { isStatic: true }
        ),
      ];

      Matter.World.add(engine.world, walls);

      const objects = Array.from(container.querySelectorAll(".object"));

      bodyBindings = objects.map((obj, index) => {
        const objRect = obj.getBoundingClientRect();
        const startX =
          Math.random() * (containerRect.width - objRect.width) +
          objRect.width / 2;
        const startY = -500 - index * 200;

        const body = Matter.Bodies.rectangle(
          startX,
          startY,
          objRect.width,
          objRect.height,
          {
            restitution: 0.5,
            friction: 0.15,
            frictionAir: 0.02,
            density: 0.002,
            chamfer: { radius: 10 },
          }
        );

        Matter.Body.setAngle(body, (Math.random() - 0.5) * Math.PI);
        Matter.World.add(engine.world, body);

        return {
          body,
          element: obj,
          width: objRect.width,
          height: objRect.height,
        };
      });

      timers.push(
        setTimeout(() => {
          if (!engine) return;
          const topWall = Matter.Bodies.rectangle(
            containerRect.width / 2,
            -wallThickness / 2,
            containerRect.width + wallThickness * 2,
            wallThickness,
            { isStatic: true }
          );
          Matter.World.add(engine.world, topWall);
        }, 3000)
      );

      intervals.push(
        setInterval(() => {
          if (!bodyBindings.length) return;
          if (Math.random() < 0.3) {
            const randomBody =
              bodyBindings[Math.floor(Math.random() * bodyBindings.length)].body;
            Matter.Body.applyForce(randomBody, randomBody.position, {
              x: (Math.random() - 0.5) * 0.02,
              y: (Math.random() - 0.5) * 0.01,
            });
          }
        }, 2000)
      );

      runner = Matter.Runner.create();
      Matter.Runner.run(runner, engine);

      const updatePositions = () => {
        bodyBindings.forEach(({ body, element, width, height }) => {
          const x = clamp(body.position.x - width / 2, 0, containerRect.width - width);
          const y = clamp(
            body.position.y - height / 2,
            -height * 3,
            containerRect.height - height - floorOffset
          );

          element.style.left = `${x}px`;
          element.style.top = `${y}px`;
          element.style.transform = `rotate(${body.angle}rad)`;
        });

        rafId = requestAnimationFrame(updatePositions);
      };

      updatePositions();
    };

    if (animeSectionRef.current) {
      const words = Array.from(
        animeSectionRef.current.querySelectorAll(".anime-text .word")
      );
      const wordHighlightBgColor = "191, 188, 180";

      triggers.push(
        ScrollTrigger.create({
          trigger: animeSectionRef.current,
          pin: true,
          start: "top top",
          end: `+=${window.innerHeight * 4}`,
          pinSpacing: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const totalWords = words.length || 1;

            words.forEach((word, index) => {
              const wordText = word.querySelector("span");
              if (!wordText) return;

              if (progress <= 0.7) {
                const revealProgress = Math.min(1, progress / 0.7);
                const overlapWords = 15;
                const totalAnimationLength = 1 + overlapWords / totalWords;
                const wordStart = index / totalWords;
                const wordEnd = wordStart + overlapWords / totalWords;

                const timelineScale =
                  1 /
                  Math.min(
                    totalAnimationLength,
                    1 + (totalWords - 1) / totalWords + overlapWords / totalWords
                  );

                const adjustedStart = wordStart * timelineScale;
                const adjustedEnd = wordEnd * timelineScale;
                const duration = adjustedEnd - adjustedStart || 1;

                const wordProgress =
                  revealProgress <= adjustedStart
                    ? 0
                    : revealProgress >= adjustedEnd
                    ? 1
                    : (revealProgress - adjustedStart) / duration;

                word.style.opacity = wordProgress;

                const backgroundFadeStart =
                  wordProgress >= 0.9 ? (wordProgress - 0.9) / 0.1 : 0;
                const backgroundOpacity = Math.max(0, 1 - backgroundFadeStart);
                word.style.backgroundColor = `rgba(${wordHighlightBgColor}, ${backgroundOpacity})`;

                const textRevealProgress =
                  wordProgress >= 0.9 ? (wordProgress - 0.9) / 0.1 : 0;
                wordText.style.opacity = Math.pow(textRevealProgress, 0.5);
              } else {
                const reverseProgress = (progress - 0.7) / 0.3;
                const reverseOverlapWords = 5;
                const reverseWordStart = index / totalWords;
                const reverseWordEnd = reverseWordStart + reverseOverlapWords / totalWords;

                const reverseTimelineScale =
                  1 /
                  Math.max(
                    1,
                    (totalWords - 1) / totalWords + reverseOverlapWords / totalWords
                  );

                const reverseAdjustedStart = reverseWordStart * reverseTimelineScale;
                const reverseAdjustedEnd = reverseWordEnd * reverseTimelineScale;
                const reverseDuration = reverseAdjustedEnd - reverseAdjustedStart || 1;

                const reverseWordProgress =
                  reverseProgress <= reverseAdjustedStart
                    ? 0
                    : reverseProgress >= reverseAdjustedEnd
                    ? 1
                    : (reverseProgress - reverseAdjustedStart) / reverseDuration;

                word.style.opacity = 1;
                if (reverseWordProgress > 0) {
                  wordText.style.opacity = 1 - reverseWordProgress;
                  word.style.backgroundColor = `rgba(${wordHighlightBgColor}, ${reverseWordProgress})`;
                } else {
                  wordText.style.opacity = 1;
                  word.style.backgroundColor = `rgba(${wordHighlightBgColor}, 0)`;
                }
              }
            });
          },
        })
      );
    }

    if (skillsSectionRef.current) {
      triggers.push(
        ScrollTrigger.create({
          trigger: skillsSectionRef.current,
          start: "top top",
          end: `+=${window.innerHeight * 3}px`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
        })
      );

      triggers.push(
        ScrollTrigger.create({
          trigger: skillsSectionRef.current,
          start: "top bottom",
          once: true,
          onEnter: initPhysics,
        })
      );
    }

    if (stickyCardsSectionRef.current) {
      const galleryCards = galleryCardRefs.current.filter(Boolean);
      const rotations = [-12, 10, -5, 5, -5, -2];

      galleryCards.forEach((galleryCard, index) => {
        gsap.set(galleryCard, {
          y: window.innerHeight,
          rotate: rotations[index] ?? 0,
        });
      });

      triggers.push(
        ScrollTrigger.create({
          trigger: stickyCardsSectionRef.current,
          start: "top top",
          end: `+=${window.innerHeight * 8}px`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const totalCards = galleryCards.length || 1;
            const progressPerCard = 1 / totalCards;

            galleryCards.forEach((galleryCard, index) => {
              const galleryCardStart = index * progressPerCard;
              let galleryCardProgress = (progress - galleryCardStart) / progressPerCard;
              galleryCardProgress = Math.min(Math.max(galleryCardProgress, 0), 1);

              let yPos = window.innerHeight * (1 - galleryCardProgress);
              let xPos = 0;

              if (galleryCardProgress === 1 && index < totalCards - 1) {
                const remainingProgress =
                  (progress - (galleryCardStart + progressPerCard)) /
                  (1 - (galleryCardStart + progressPerCard));

                if (remainingProgress > 0) {
                  const distanceMultiplier = 1 - index * 0.15;
                  xPos = -window.innerWidth * 0.3 * distanceMultiplier * remainingProgress;
                  yPos = -window.innerHeight * 0.3 * distanceMultiplier * remainingProgress;
                }
              }

              gsap.set(galleryCard, {
                y: yPos,
                x: xPos,
              });
            });
          },
        })
      );
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);

      intervals.forEach((intervalId) => clearInterval(intervalId));
      timers.forEach((timerId) => clearTimeout(timerId));
      triggers.forEach((trigger) => trigger.kill());

      if (runner) Matter.Runner.stop(runner);
      if (engine) {
        Matter.World.clear(engine.world, false);
        Matter.Engine.clear(engine);
      }
    };
  }, []);

  return (
    <ReactLenis root>
      <div className="page about">
        <AboutResizeHero />

        <section className="about-hero">
          <div className="about-hero-img">
            <img src="/about/about-hero.jpg" alt="About hero" />
          </div>
          <div className="about-header">
            <h2>The Alchemist Behind It</h2>
          </div>
        </section>

        <section ref={animeSectionRef} className="anime-text-container">
          <div className="about-spotlight-top-bar">
            <div className="about-bar-content">
              <div className="symbol">
                <img src="/global/logo.png" alt="Logo" />
              </div>
              <div className="symbol">
                <img src="/global/logo.png" alt="Logo" />
              </div>
            </div>
          </div>

          <div className="about-spotlight-bottom-bar">
            <div className="about-bar-content">
              <p className="primary sm">▸ Specs loaded</p>
              <p className="primary sm">/ Readme.md</p>
            </div>
          </div>

          <div className="copy-container">
            <div className="anime-text">
              {paragraphWords.map((paragraph, pIndex) => (
                <p key={`paragraph-${pIndex}`}>
                  {paragraph.map((wordData, wIndex) => (
                    <span
                      key={`word-${pIndex}-${wIndex}`}
                      className={`word ${wordData.isKeyword ? "keyword-wrapper" : ""}`}
                    >
                      <span
                        className={wordData.isKeyword ? `keyword ${wordData.normalizedWord}` : ""}
                      >
                        {wordData.word}
                      </span>{" "}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section ref={skillsSectionRef} className="about-skills">
          <div className="container">
            <div className="about-skills-col">
              <div className="about-skills-copy-wrapper">
                <p className="primary sm">▸ Proving gravity applies to divs too</p>
                <h3>Things I know that make the web cooler</h3>
              </div>
            </div>

            <div className="about-skills-col skills-playground">
              <div ref={objectContainerRef} className="object-container">
                <div className="object os-1"><p className="primary sm">HTML</p></div>
                <div className="object os-2"><p className="primary sm">CSS</p></div>
                <div className="object os-3"><p className="primary sm">JavaScript</p></div>
                <div className="object os-1"><p className="primary sm">GSAP</p></div>
                <div className="object os-2"><p className="primary sm">ScrollTrigger</p></div>
                <div className="object os-3"><p className="primary sm">Lenis</p></div>
                <div className="object os-1"><p className="primary sm">React</p></div>
                <div className="object os-2"><p className="primary sm">Node.js</p></div>
                <div className="object os-3"><p className="primary sm">WebGL</p></div>
                <div className="object os-1"><p className="primary sm">Three.js</p></div>
                <div className="object os-2"><p className="primary sm">Docker</p></div>
                <div className="object os-3"><p className="primary sm">Kubernetes</p></div>
                <div className="object os-1"><p className="primary sm">Grafana</p></div>
                <div className="object os-2"><p className="primary sm">Figma</p></div>
                <div className="object os-3"><p className="primary sm">Java</p></div>
                <div className="object os-1"><p className="primary sm">Go</p></div>
                <div className="object os-2"><p className="primary sm">C</p></div>
                <div className="object os-3"><p className="primary sm">Next.js</p></div>
                <div className="object os-1"><p className="primary sm">Prometheus</p></div>
              </div>
            </div>
          </div>
        </section>

        

        <section className="about-outro">
          <div className="about-outro-inner">
            <h3>Scroll ends but ideas do not</h3>
            <p>
              This space is a running log of experiments, shipping notes, and
              design instincts tested in the wild.
            </p>
            <div className="about-outro-tags">
              <span>Frontend</span>
              <span>Motion</span>
              <span>Product Thinking</span>
              <span>Systems</span>
              <span>UI Craft</span>
              <span>Shipped Work</span>
            </div>
          </div>
        </section>

        <ContactForm />
        <Footer />
      </div>
    </ReactLenis>
  );
};

export default Transition(About);
