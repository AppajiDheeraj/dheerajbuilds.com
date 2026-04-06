import "./SplitCardShowcase.css";
import { useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    id: "01",
    image: "/home/turn-card-1.png",
    title: "Interactive Web Experiences",
  },
  {
    id: "02",
    image: "/home/turn-card-2.png",
    title: "Thoughtful Design Language",
  },
  {
    id: "03",
    image: "/home/turn-card-3.png",
    title: "Visual Design Systems",
  },
];

const SplitCardShowcase = () => {
  const sectionRef = useRef(null);
  const stickyHeaderRef = useRef(null);
  const cardContainerRef = useRef(null);
  const cardRefs = useRef([]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1000px)", () => {
        const cardsEl = cardRefs.current.filter(Boolean);
        const edgeCards = [cardsEl[0], cardsEl[2]].filter(Boolean);

        gsap.set(stickyHeaderRef.current, { y: 40, autoAlpha: 0 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=300%",
            scrub: 1,
            pin: true,
            pinSpacing: true,
            invalidateOnRefresh: true,
          },
        });

        timeline
          // First phase reveals heading and compresses layout before card flips begin.
          .to(
            stickyHeaderRef.current,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.5,
              ease: "power2.out",
            },
            0.1
          )
          .to(
            cardContainerRef.current,
            {
              width: "60%",
              duration: 0.45,
              ease: "power2.out",
            },
            0
          )
          .to(
            cardContainerRef.current,
            {
              gap: "20px",
              duration: 0.35,
              ease: "power2.out",
            },
            0.45
          )
          .to(
            cardsEl,
            {
              borderRadius: "20px",
              duration: 0.35,
              ease: "power2.out",
              stagger: 0.03,
            },
            0.45
          )
          .to(
            cardsEl,
            {
              rotationY: 180,
              duration: 0.7,
              ease: "power3.inOut",
              stagger: 0.1,
            },
            0.72
          )
          .to(
            edgeCards,
            {
              y: 30,
              rotationZ: (index) => (index === 0 ? -15 : 15),
              duration: 0.7,
              ease: "power3.inOut",
            },
            0.72
          );

        return () => {
          if (timeline.scrollTrigger) {
            timeline.scrollTrigger.kill();
          }
          timeline.kill();
        };
      });

      mm.add("(max-width: 999px)", () => {
        // Mobile layout intentionally disables pin/3D effects for smoother touch scrolling.
        gsap.set([stickyHeaderRef.current, cardContainerRef.current, ...cardRefs.current], {
          clearProps: "all",
        });
      });

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section className="split-cards" ref={sectionRef}>
      <div className="split-cards-sticky-header">
        <h2 ref={stickyHeaderRef}>Three pillars with one purpose</h2>
      </div>

      <div className="split-cards-container" ref={cardContainerRef}>
        {cards.map((card, index) => (
          <article
            key={card.id}
            className={`split-card split-card-${index + 1}`}
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
          >
            <div className="split-card-front">
              <img src={card.image} alt={card.title} loading="lazy" />
            </div>
            <div className="split-card-back">
              <span>({card.id})</span>
              <p>{card.title}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default SplitCardShowcase;
