import React from "react";
import "./Project.css";

import ParallaxImage from "../../components/ParallaxImage/ParallaxImage";
import RevealText from "../../components/RevealText/RevealText";
import { siteConfig } from "../../data";

import ReactLenis from "lenis/react";

const Project = () => {
  return (
    <ReactLenis root>
      <div className="page project">
        <section className="project-header">
          <RevealText
            delay={1}
            animateOnScroll={false}
            className="primary sm"
          >
            Short film on self-discovery
          </RevealText>
          <RevealText tag="h2" delay={1}>
            Fragments of Light
          </RevealText>
        </section>

        <section className="project-banner-img">
          <div className="project-banner-img-wrapper">
            <ParallaxImage src="/project/banner.jpg" alt="" />
          </div>
        </section>

        <section className="project-details">
          <div className="details">
            <RevealText tag="p" animateOnScroll={true} className="primary sm">
              Overview
            </RevealText>
            <RevealText tag="h4" animateOnScroll={true}>
              A visual meditation on identity, *Fragments of Light* explores the
              quiet journey of self-discovery through minimalism, mood, and
              motion.
            </RevealText>
          </div>

          <div className="details">
            <RevealText tag="p" animateOnScroll={true} className="primary sm">
              Year
            </RevealText>
            <RevealText tag="h4" animateOnScroll={true}>
              2024
            </RevealText>
          </div>

          <div className="details">
            <RevealText tag="p" animateOnScroll={true} className="primary sm">
              Category
            </RevealText>
            <RevealText tag="h4" animateOnScroll={true}>
              Short Film
            </RevealText>
          </div>

          <div className="details">
            <RevealText tag="p" animateOnScroll={true} className="primary sm">
              Running Time
            </RevealText>
            <RevealText tag="h4" animateOnScroll={true}>
              6:30
            </RevealText>
          </div>

          <div className="details">
            <RevealText tag="p" animateOnScroll={true} className="primary sm">
              Directed by
            </RevealText>
            <RevealText tag="h4" animateOnScroll={true}>
              {siteConfig.person.fullName}
            </RevealText>
          </div>
        </section>

        <section className="project-images">
          <div className="project-images-container">
            <div className="project-img">
              <div className="project-img-wrapper">
                <ParallaxImage src="/project/project-1.jpg" alt="" />
              </div>
            </div>

            <div className="project-img">
              <div className="project-img-wrapper">
                <ParallaxImage src="/project/project-2.jpg" alt="" />
              </div>
            </div>

            <div className="project-img">
              <div className="project-img-wrapper">
                <ParallaxImage src="/project/project-3.jpg" alt="" />
              </div>
            </div>

            <div className="project-img">
              <div className="project-img-wrapper">
                <ParallaxImage src="/project/project-4.jpg" alt="" />
              </div>
            </div>

            <div className="project-img">
              <div className="project-img-wrapper">
                <ParallaxImage src="/project/project-5.jpg" alt="" />
              </div>
            </div>
          </div>
        </section>

        <section className="project-details">
          <div className="details">
            <RevealText tag="p" animateOnScroll={true} className="primary sm">
              Editor
            </RevealText>
            <RevealText tag="h4" animateOnScroll={true}>
              {siteConfig.person.fullName}
            </RevealText>
          </div>

          <div className="details">
            <RevealText tag="p" animateOnScroll={true} className="primary sm">
              Sound Design
            </RevealText>
            <RevealText tag="h4" animateOnScroll={true}>
              Elena Brooks
            </RevealText>
          </div>

          <div className="details">
            <RevealText tag="p" animateOnScroll={true} className="primary sm">
              Art Director
            </RevealText>
            <RevealText tag="h4" animateOnScroll={true}>
              Milo Vance
            </RevealText>
          </div>

          <div className="details">
            <RevealText tag="p" animateOnScroll={true} className="primary sm">
              Producer
            </RevealText>
            <RevealText tag="h4" animateOnScroll={true}>
              Asha Lennox
            </RevealText>
          </div>

          <div className="details">
            <RevealText tag="p" animateOnScroll={true} className="primary sm">
              Director
            </RevealText>
            <RevealText tag="h4" animateOnScroll={true}>
              {siteConfig.person.fullName}
            </RevealText>
          </div>
        </section>

        <section className="next-project">
          <RevealText tag="p" animateOnScroll={true} className="primary sm">
            02 - 05
          </RevealText>
          <RevealText tag="h3" animateOnScroll={true}>
            Next
          </RevealText>

          <div className="next-project-img">
            <div className="next-project-img-wrapper">
              <ParallaxImage src="/work/work-2.jpg" alt="" />
            </div>
          </div>

          <RevealText tag="h4" animateOnScroll={true}>
            Market Pulse
          </RevealText>
        </section>
      </div>
    </ReactLenis>
  );
};

export default Project;
