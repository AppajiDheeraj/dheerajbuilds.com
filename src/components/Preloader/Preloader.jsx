import "./Preloader.css";
import { useEffect, useState, useRef } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText);

const Preloader = ({ onAnimationComplete }) => {
  const [showPreloader, setShowPreloader] = useState(true);
  const [loaderAnimating, setLoaderAnimating] = useState(true);
  const wrapperRef = useRef(null);
  const lenis = useLenis();

  useEffect(() => {
    // Lock both Lenis and native scroll so users cannot bypass the intro state.
    if (loaderAnimating) {
      if (lenis) lenis.stop();
      document.body.style.overflow = "hidden";
    } else {
      if (lenis) lenis.start();
      document.body.style.overflow = "";
    }
  }, [lenis, loaderAnimating]);

  useGSAP(
    () => {
      if (!showPreloader) return;

      const startAnimation = () => {
        const logoSplit = SplitText.create(".preloader-logo h1", {
          type: "chars",
          charsClass: "char",
          mask: "chars",
        });

        gsap.set(logoSplit.chars, { x: "110%" });
        gsap.set(".preloader-logo h1", { opacity: 1 });

        function animateProgress(duration = 1.15) {
          const tl = gsap.timeline();
          // Keep progress timing centralized so visual pacing can be tuned in one place.
          tl.to(".preloader-progress-bar", {
            scaleX: 1,
            duration,
            ease: "sine.inOut",
          });

          return tl;
        }

        const isMobile = window.innerWidth < 1000;
        const maskScale = isMobile ? 25 : 15;

        const tl = gsap.timeline({
          delay: 0.1,
          onComplete: () => {
            setLoaderAnimating(false);
            window.setTimeout(() => {
              setShowPreloader(false);
              if (onAnimationComplete) onAnimationComplete();
            }, 60);
          },
        });

        tl.to(logoSplit.chars, {
          x: "0%",
          stagger: 0.04,
          ease: "expo.out",
          duration: 0.9,
        })
          .add(animateProgress(), "<")
          .to(
            logoSplit.chars,
            {
              x: "-110%",
              stagger: 0.035,
              duration: 0.9,
              ease: "power3.inOut",
            },
            "-=0.45"
          )
          .to(
            ".preloader-progress",
            {
              opacity: 0,
              duration: 0.7,
              ease: "sine.out",
            },
            "-=0.4"
          )
          .to(
            ".preloader-mask",
            {
              scale: maskScale,
              duration: 0.7,
              ease: "expo.inOut",
            },
            "<"
          );
      };

      startAnimation();
    },
    { scope: wrapperRef, dependencies: [showPreloader, onAnimationComplete] }
  );

  if (!showPreloader) return null;

  return (
    <div className="preloader-wrapper" ref={wrapperRef}>
      <div className="preloader-progress">
        <div className="preloader-progress-bar"></div>
        <div className="preloader-logo">
          <h1>Appaji</h1>
        </div>
      </div>
      <div className="preloader-mask"></div>
    </div>
  );
};

export default Preloader;
