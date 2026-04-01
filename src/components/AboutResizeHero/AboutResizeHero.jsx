import React, { useEffect, useMemo } from "react";
import "./AboutResizeHero.css";

const SCENE_MODULES = import.meta.glob(
  "./assets/*.svg",
  { eager: true, query: "?raw", import: "default" }
);

const buildSceneMarkup = (svgs) => {
  const get = (name) => svgs.get(name) || "";

  return [
    get("scene0-stars.svg"),
    get("scene0.svg"),
    '<div class="airplanes">',
    get("scene0-airplane.svg"),
    get("scene0-airplane2.svg"),
    "</div>",
    '<div class="reflection"></div>',
    get("scene1.svg"),
    '<div class="window"></div>',
    get("scene2.svg"),
    '<div class="haze"></div>',
    get("elevator-left.svg"),
    get("elevator-right.svg"),
    get("scene3.svg"),
    get("scene4-standby.svg"),
    get("scene4.svg"),
    '<div class="fade"></div>',
    // get("scene5-stuff1.svg"),
    // get("scene5-stuff2.svg"),
    // get("scene5-stuff3.svg"),
    // get("scene5.svg"),
    // get("scene5-page1.svg"),
    // get("scene5-page2.svg"),
    // get("scene5-page3.svg"),
  ].join("\n");
};

const AboutResizeHero = () => {
  const markup = useMemo(() => {
    const svgMap = new Map(
      Object.entries(SCENE_MODULES).map(([modulePath, svgText]) => {
        const fileName = modulePath.split("/").pop();
        return [fileName, svgText];
      })
    );

    return buildSceneMarkup(svgMap);
  }, []);

  // const sceneText = useMemo(
  //   () =>
  //     "As you resize your browser window, the artwork transitions through layered scenes and creates a forward-through-space effect.",
  //   []
  // );

  useEffect(() => {
    const styleId = "about-resize-typetura-style";
    let typeturaStyle = document.getElementById(styleId);

    if (!typeturaStyle) {
      typeturaStyle = document.createElement("style");
      typeturaStyle.id = styleId;
      typeturaStyle.innerHTML =
        "html{--tt-base:20;--tt-scale:1;--tt-ease:linear;--tt-max:1600}*,:before,:after,html{--tt-key:none;animation:var(--tt-key) 1s var(--tt-ease) 1 calc(-1s * var(--tt-bind) / var(--tt-max)) both paused}";
      document.head.insertBefore(typeturaStyle, document.head.firstChild);
    }

    if (typeof window.ResizeObserver === "undefined") return;

    const root = document.documentElement;
    const observer = new window.ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        entries.forEach((entry) => {
          if (entry.contentRect) {
            entry.target.style.setProperty("--tt-bind", `${entry.contentRect.width}`);
          }
        });
      });
    });

    observer.observe(root);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="about-resize-hero" aria-label="Interactive resize hero">
      <main
        className="about-resize-main"
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    </section>
  );
};

export default AboutResizeHero;
