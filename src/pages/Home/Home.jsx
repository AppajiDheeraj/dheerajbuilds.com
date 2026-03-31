import workList from "../../data/workList";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

import AnimatedCopy from "../../components/AnimatedCopy/AnimatedCopy";
import Reviews from "../../components/Reviews/Reviews";
import ContactForm from "../../components/ContactForm/ContactForm";
import Footer from "../../components/Footer/Footer";
import DotMatrix from "../../components/DotMatrix/DotMatrix";
import Copy from "../../components/Copy/Copy";
import BrandIcon from "../../components/BrandIcon/BrandIcon";
import MarqueeBanner from "../../components/MarqueeBanner/MarqueeBanner";
import SplitCardShowcase from "../../components/SplitCardShowcase/SplitCardShowcase";
import TeamCards from "../../components/TeamCards/TeamCards";
import FieldworkRoutine from "../../components/FieldworkRoutine/FieldworkRoutine";
import { siteConfig } from "../../data";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactLenis from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

import Transition from "../../components/Transition/Transition";

const Home = ({ isPreloaderComplete = false }) => {
  const workItems = Array.isArray(workList) ? workList : [];
  const stickyTitlesRef = useRef(null);
  const titlesRef = useRef([]);
  const stickyWorkHeaderRef = useRef(null);
  const homeWorkRef = useRef(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const hasSeenHomeMatrix = sessionStorage.getItem("home-dot-matrix-seen");

    if (hasSeenHomeMatrix) {
      setIsInitialLoad(false);
      return;
    }

    sessionStorage.setItem("home-dot-matrix-seen", "true");
  }, []);

  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    const stickySection = stickyTitlesRef.current;
    const titles = titlesRef.current.filter(Boolean);

    if (!stickySection || titles.length !== 3) {
      window.removeEventListener("resize", handleResize);
      return;
    }

    gsap.set(titles[0], { opacity: 1, scale: 1 });
    gsap.set(titles[1], { opacity: 0, scale: 0.75 });
    gsap.set(titles[2], { opacity: 0, scale: 0.75 });

    const pinTrigger = ScrollTrigger.create({
      trigger: stickySection,
      start: "top top",
      end: `+=${window.innerHeight * 5}`,
      pin: true,
      pinSpacing: true,
    });

    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: stickySection,
        start: "top top",
        end: `+=${window.innerHeight * 4}`,
        scrub: 0.5,
      },
    });

    masterTimeline
      .to(
        titles[0],
        {
          opacity: 0,
          scale: 0.75,
          duration: 0.3,
          ease: "power2.out",
        },
        1
      )

      .to(
        titles[1],
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.in",
        },
        1.25
      );

    masterTimeline
      .to(
        titles[1],
        {
          opacity: 0,
          scale: 0.75,
          duration: 0.3,
          ease: "power2.out",
        },
        2.5
      )

      .to(
        titles[2],
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.in",
        },
        2.75
      );

    const workHeaderSection = stickyWorkHeaderRef.current;
    const homeWorkSection = homeWorkRef.current;

    let workHeaderPinTrigger;
    if (workHeaderSection && homeWorkSection) {
      workHeaderPinTrigger = ScrollTrigger.create({
        trigger: workHeaderSection,
        start: "top top",
        endTrigger: homeWorkSection,
        end: "bottom bottom",
        pin: true,
        pinSpacing: false,
      });
    }

    return () => {
      pinTrigger.kill();
      if (workHeaderPinTrigger) {
        workHeaderPinTrigger.kill();
      }
      if (masterTimeline.scrollTrigger) {
        masterTimeline.scrollTrigger.kill();
      }
      masterTimeline.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ReactLenis root>
      <div className="page home">
        <section className="hero">
            {isPreloaderComplete && (
              <DotMatrix
                color="#969992"
                dotSize={2}
                spacing={5}
                opacity={0.9}
                delay={isInitialLoad ? 2 : 0.5}
              />
            )}

          <div className="hero-center">
            <h1>{siteConfig.person.firstName}</h1>
            <h1>{siteConfig.person.lastName}</h1>
          </div>

          <div className="hero-footer">
            <div className="hero-footer-left">
              <p>Appaji Dheeraj designs and builds scalable, production-ready systems with a focus on clean architecture and thoughtful execution. From concept to deployment — structured, efficient, and purposeful.</p>
            </div>
            <div className="hero-footer-right">
              <p className="primary sm">▸ INTERFACE ALCHEMY</p>
              <p className="primary sm">▸ SCROLL SORCERY</p>
            </div>
          </div>
        </section>

        <section className="about">
        <div className="container">
          <div className="about-copy">
            <Copy type="flicker">
              <p>Design. Code. Create.</p>
            </Copy>
            <Copy>
              <h3>
                Creating experiences that go beyond the screen.
              </h3>
            </Copy>
            <div className="about-icon">
              <BrandIcon />
            </div>
          </div>
        </div>
        <div className="section-footer light">
          <Copy type="flicker">
            <p>/ Core State /</p>
          </Copy>
        </div>
      </section>

      <MarqueeBanner />
      <SplitCardShowcase />
      <TeamCards />
      <FieldworkRoutine />  

        <section className="hobbies">
          <div className="hobby">
            <AnimatedCopy tag="h4" animateOnScroll={true}>
              {siteConfig.home.hobbies[0]}
            </AnimatedCopy>
          </div>
          <div className="hobby">
            <AnimatedCopy tag="h4" animateOnScroll={true}>
              {siteConfig.home.hobbies[1]}
            </AnimatedCopy>
          </div>
          <div className="hobby">
            <AnimatedCopy tag="h4" animateOnScroll={true}>
              {siteConfig.home.hobbies[2]}
            </AnimatedCopy>
          </div>
          <div className="hobby">
            <AnimatedCopy tag="h4" animateOnScroll={true}>
              {siteConfig.home.hobbies[3]}
            </AnimatedCopy>
          </div>
        </section>

        <ContactForm />
        <Footer />
      </div>
    </ReactLenis>
  );
};

export default Transition(Home);
