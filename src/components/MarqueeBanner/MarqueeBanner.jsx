import "./MarqueeBanner.css";
import { useRef } from "react";
import { siteConfig } from "../../data";

import TextReveal from "../TextReveal/TextReveal";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MarqueeBanner = () => {
  const { marquee } = siteConfig;
  const marqueeBannerRef = useRef(null);
  const marquee1Ref = useRef(null);
  const marquee2Ref = useRef(null);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: marqueeBannerRef.current,
        start: "top bottom",
        end: "150% top",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;

          const marquee1X = 25 - progress * 50;
          gsap.set(marquee1Ref.current, { x: `${marquee1X}%` });

          const marquee2X = -25 + progress * 50;
          gsap.set(marquee2Ref.current, { x: `${marquee2X}%` });
        },
      });
    },
    { scope: marqueeBannerRef }
  );

  return (
    <section className="marquee-banner" ref={marqueeBannerRef}>
      <div className="marquees">
        <div className="marquee-header marquee-header-1" ref={marquee1Ref}>
          <h1>{marquee.headlinePrimary}</h1>
        </div>
        <div className="marquee-header marquee-header-2" ref={marquee2Ref}>
          <h1>{marquee.headlineSecondary}</h1>
        </div>
      </div>
      <div className="banner">
        <div className="banner-content">
          <TextReveal>
            <h4>{marquee.bannerCopy}</h4>
          </TextReveal>
        </div>
        <div className="banner-img">
          <img src={marquee.bannerImage} alt="" />
        </div>
        <div className="banner-logo">
          <h5>{marquee.bannerLogo}</h5>
        </div>
      </div>
    </section>
  );
};

export default MarqueeBanner;
