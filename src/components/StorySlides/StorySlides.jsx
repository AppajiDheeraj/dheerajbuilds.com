import "./StorySlides.css";
import { useEffect, useRef, useState } from "react";
import storySlides from "../../data/storySlides";
import { siteConfig } from "../../data";
import { gsap } from "gsap";
import { Github } from "lucide-react";
import Button from "../Button/Button.jsx";

export default function StorySlides() {
  const stories = storySlides;
  const storiesContainerRef = useRef(null);
  const copyRef = useRef(null);
  const imageRef = useRef(null);
  const cycleTimeoutRef = useRef(null);
  const animationRef = useRef(null);
  const activeStoryRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const preloadedSourcesRef = useRef(new Set());
  const [activeStory, setActiveStory] = useState(0);
  const [progressSeed, setProgressSeed] = useState(0);

  const storyDuration = 4600;

  useEffect(() => {
    if (typeof window === "undefined" || !stories.length) {
      return;
    }

    stories.forEach((story, index) => {
      if (index === 0 || preloadedSourcesRef.current.has(story.storyImg)) {
        return;
      }

      const image = new window.Image();
      image.src = story.storyImg;
      preloadedSourcesRef.current.add(story.storyImg);
    });
  }, [stories]);

  useEffect(() => {
    activeStoryRef.current = activeStory;
  }, [activeStory]);

  useEffect(() => {
    if (typeof window === "undefined" || !stories.length) {
      return undefined;
    }

    const scheduleNext = () => {
      if (cycleTimeoutRef.current) {
        window.clearTimeout(cycleTimeoutRef.current);
      }

      cycleTimeoutRef.current = window.setTimeout(() => {
        if (isAnimatingRef.current) {
          scheduleNext();
          return;
        }

        const currentIndex = activeStoryRef.current;
        const nextIndex = (currentIndex + 1) % stories.length;

        setActiveStory(nextIndex);
        setProgressSeed((seed) => seed + 1);
      }, storyDuration);
    };

    scheduleNext();

    return () => {
      if (cycleTimeoutRef.current) {
        window.clearTimeout(cycleTimeoutRef.current);
      }
    };
  }, [stories, storyDuration, progressSeed]);

  useEffect(() => {
    const copy = copyRef.current;
    const currentImage = imageRef.current;

    if (!copy || !currentImage) {
      return undefined;
    }

    const animatedCopy = copy.querySelectorAll("[data-story-animate]");

    animationRef.current?.kill();

    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      onStart: () => {
        isAnimatingRef.current = true;
      },
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    gsap.set(currentImage, {
      opacity: 0,
      scale: 1.06,
      y: 18,
      clipPath: "inset(0 4% 0 0)",
    });

    timeline.to(
      currentImage,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        clipPath: "inset(0 0 0 0)",
        duration: 0.82,
        ease: "power3.out",
      },
      0
    );

    gsap.set(animatedCopy, { y: 22, opacity: 0 });
    timeline.to(
      animatedCopy,
      {
        y: 0,
        opacity: 1,
        duration: 0.72,
        stagger: 0.08,
      },
      0.12
    );

    animationRef.current = timeline;

    return () => {
      timeline.kill();
    };
  }, [activeStory]);

  const handleAdvance = () => {
    if (isAnimatingRef.current || !stories.length) {
      return;
    }

    if (cycleTimeoutRef.current) {
      window.clearTimeout(cycleTimeoutRef.current);
    }

    const currentIndex = activeStoryRef.current;
    const nextIndex = (currentIndex + 1) % stories.length;

    setActiveStory(nextIndex);
    setProgressSeed((seed) => seed + 1);
  };

  if (!stories.length) {
    return null;
  }

  const activeItem = stories[activeStory];

  return (
    <section
      className="stories-container stories"
      ref={storiesContainerRef}
      onClick={handleAdvance}
      aria-label="Selected work"
    >
      <div className="story-img">
        <div className="img img--current">
          <img
            key={activeItem.storyImg}
            ref={imageRef}
            src={activeItem.storyImg}
            alt={activeItem.name}
            loading="eager"
            fetchPriority="high"
            draggable="false"
          />
        </div>
      </div>

      <div className="stories-footer">
        <div className="container">
          <p className="sm">{siteConfig.work.storySlidesFooterLabel}</p>
          <p className="sm">{siteConfig.work.storySlidesFooterMeta}</p>
        </div>
      </div>

      <div className="story-content">
        <div className="row">
          <div className="indices">
            {stories.map((_, index) => (
              <div
                className={`index ${index === activeStory ? "is-active" : ""}`}
                key={`index-${index}`}
              >
                <div
                  className="index-highlight"
                  key={`highlight-${index}-${index === activeStory ? progressSeed : "idle"}`}
                  style={
                    index === activeStory
                      ? { animationDuration: `${storyDuration}ms` }
                      : undefined
                  }
                ></div>
              </div>
            ))}
          </div>

          <div className="profile">
            <div className="profile-icon">
              <Github size={18} strokeWidth={2.2} aria-hidden="true" />
            </div>

            <div className="profile-name">
              <p data-story-animate>{activeItem.name}</p>
            </div>
          </div>
        </div>

        <div className="row row--content" ref={copyRef}>
          <div className="title">
            <div className="title-row">
              <h1 data-story-animate>{activeItem.name.toUpperCase()}</h1>
            </div>
            <div className="story-description">
              <p data-story-animate>{activeItem.description}</p>
            </div>
          </div>

          <div
            className="link"
            data-story-animate
            onClick={(event) => event.stopPropagation()}
          >
            <Button
              variant="light"
              href={activeItem.linkSrc}
              target="_blank"
              disableTextAnimation
            >
              {activeItem.linkLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
