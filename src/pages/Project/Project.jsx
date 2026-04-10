import React from "react";
import "./Project.css";

import ParallaxImage from "../../components/ParallaxImage/ParallaxImage";
import RevealText from "../../components/RevealText/RevealText";
import { siteConfig } from "../../data";

import ReactLenis from "lenis/react";

const Project = () => {
  const projectConfig = siteConfig.projectPage;

  return (
    <ReactLenis root>
      <div className="page project">
        <section className="project-header">
          <RevealText
            delay={1}
            animateOnScroll={false}
            className="primary sm"
          >
            {projectConfig.headerEyebrow}
          </RevealText>
          <RevealText tag="h2" delay={1}>
            {projectConfig.headerTitle}
          </RevealText>
        </section>

        <section className="project-banner-img">
          <div className="project-banner-img-wrapper">
            <ParallaxImage src={projectConfig.bannerImage} alt="" />
          </div>
        </section>

        <section className="project-details">
          <div className="details">
            <RevealText tag="p" animateOnScroll={true} className="primary sm">
              {projectConfig.overviewLabel}
            </RevealText>
            <RevealText tag="h4" animateOnScroll={true}>
              {projectConfig.overviewCopy}
            </RevealText>
          </div>

          {projectConfig.meta.map((item) => (
            <div className="details" key={item.label}>
              <RevealText tag="p" animateOnScroll={true} className="primary sm">
                {item.label}
              </RevealText>
              <RevealText tag="h4" animateOnScroll={true}>
                {item.value}
              </RevealText>
            </div>
          ))}
        </section>

        <section className="project-images">
          <div className="project-images-container">
            {projectConfig.images.map((image, index) => (
              <div className="project-img" key={`${image}-${index}`}>
                <div className="project-img-wrapper">
                  <ParallaxImage src={image} alt="" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="project-details">
          {projectConfig.credits.map((credit) => (
            <div className="details" key={credit.label}>
              <RevealText tag="p" animateOnScroll={true} className="primary sm">
                {credit.label}
              </RevealText>
              <RevealText tag="h4" animateOnScroll={true}>
                {credit.value}
              </RevealText>
            </div>
          ))}
        </section>

        <section className="next-project">
          <RevealText tag="p" animateOnScroll={true} className="primary sm">
            {projectConfig.next.index}
          </RevealText>
          <RevealText tag="h3" animateOnScroll={true}>
            {projectConfig.next.label}
          </RevealText>

          <div className="next-project-img">
            <div className="next-project-img-wrapper">
              <ParallaxImage src={projectConfig.next.image} alt="" />
            </div>
          </div>

          <RevealText tag="h4" animateOnScroll={true}>
            {projectConfig.next.title}
          </RevealText>
        </section>
      </div>
    </ReactLenis>
  );
};

export default Project;
