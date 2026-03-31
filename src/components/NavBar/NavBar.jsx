import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavBar.css";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { FileDown } from "lucide-react";

gsap.registerPlugin(SplitText);

const NavBar = () => {
  const menuRef = useRef(null);
  const menuHeaderRef = useRef(null);
  const menuOverlayRef = useRef(null);
  const menuItemsRef = useRef([]);
  const menuFooterRef = useRef(null);
  const hamburgerMenuRef = useRef(null);
  const timeRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const isAnimating = useRef(false);
  const splitTexts = useRef([]);
  const footerSplitTexts = useRef([]);
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);

    // Scramble Text Animation
  const scrambleText = (elements) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    elements.forEach((char) => {
      const originalText = char.textContent;
      let iterations = 0;
      const maxIterations = Math.floor(Math.random() * 6) + 3;

      gsap.set(char, { opacity: 1 });

      const scrambleInterval = setInterval(() => {
        char.textContent = chars[Math.floor(Math.random() * chars.length)];
        if (++iterations >= maxIterations) {
          clearInterval(scrambleInterval);
          char.textContent = originalText;
        }
      }, 35);
    });
  };

  // Auto-close menu on route change
  useEffect(() => {
    if (location.pathname !== previousPathRef.current && isOpen) {
      closeMenu();
    }
    previousPathRef.current = location.pathname;
  }, [location.pathname]);

  // Close menu when clicking outside the header and overlay areas.
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event) => {
      const clickedInsideOverlay = menuOverlayRef.current?.contains(event.target);
      const clickedInsideHeader = menuHeaderRef.current?.contains(event.target);

      if (!clickedInsideOverlay && !clickedInsideHeader) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isOpen]);
    
    // Initial Setup Effect
  useEffect(() => {
    gsap.set(menuOverlayRef.current, {
      scaleY: 0,
      transformOrigin: "top center",
    });
    gsap.set(menuFooterRef.current, { opacity: 0, y: 20 });

    menuItemsRef.current.forEach((item) => {
      const link = item.querySelector("a");
      if (link) {
        const split = new SplitText(link, { type: "words", wordsClass: "word" });
        splitTexts.current.push(split);
        gsap.set(split.words, { yPercent: 120 });
      }
    });
    gsap.set(menuItemsRef.current, { opacity: 1 });

    const footerElements = menuFooterRef.current.querySelectorAll(
      ".menu-social a, .menu-social span, .menu-time"
    );
    footerElements.forEach((element) => {
      const split = new SplitText(element, { type: "chars" });
      footerSplitTexts.current.push(split);
      gsap.set(split.chars, { opacity: 0 });
    });

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        menuRef.current.classList.add("hidden");
      } else {
        menuRef.current.classList.remove("hidden");
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    const updateTime = () => {
      if (timeRef.current) {
        const now = new Date();
        const timeString = now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        timeRef.current.textContent = `${timeString} LOCAL`;
      }
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timeInterval);
      splitTexts.current.forEach((s) => s.revert());
      footerSplitTexts.current.forEach((s) => s.revert());
    };
  }, []);

    // Open Menu Animation
  const openMenu = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setIsOpen(true);

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
      },
    });

    tl.to(menuOverlayRef.current, {
      duration: 0.5,
      scaleY: 1,
      ease: "power3.out",
    });

    const allWords = splitTexts.current.flatMap((s) => s.words);
    tl.to(
      allWords,
      { duration: 0.75, yPercent: 0, stagger: 0.05, ease: "power4.out" },
      "-=0.3"
    );

    tl.to(
      menuFooterRef.current,
      {
        duration: 0.4,
        y: 0,
        opacity: 1,
        ease: "power2.out",
        onComplete: () => {
          const allFooterChars = footerSplitTexts.current.flatMap((s) => s.chars);
          allFooterChars.forEach((char, index) => {
            setTimeout(() => scrambleText([char]), index * 30);
          });
        },
      },
      "-=0.75"
    );
  };

    // Close Menu Animation
  const closeMenu = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setIsOpen(false);

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
      },
    });

    tl.to(menuFooterRef.current, {
      duration: 0.3,
      y: 20,
      opacity: 0,
      ease: "power2.in",
    });

    const allWords = splitTexts.current.flatMap((s) => s.words);
    tl.to(
      allWords,
      { duration: 0.25, yPercent: 120, stagger: -0.025, ease: "power2.in" },
      "-=0.25"
    );

    tl.to(
      menuOverlayRef.current,
      { duration: 0.5, scaleY: 0, ease: "power3.inOut" },
      "-=0.2"
    );
  };

  const toggleMenu = () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const handleMenuLinkClick = () => {
    closeMenu();
  };

  return (
    <>
      <div className="top-corner-badge top-corner-badge-left" aria-hidden="true">
        APPAJI
      </div>

      <a
        className="top-corner-badge top-corner-badge-right"
        href="/Appaji_Dheeraj_Resume.pdf"
        download
        aria-label="Download resume"
      >
        <FileDown size={16} strokeWidth={2.5} />
      </a>

      <nav className="menu" ref={menuRef}>
        <div className="menu-header" ref={menuHeaderRef} onClick={toggleMenu}>
          <Link to="/" className="menu-logo" aria-label="Home">
            <img
              src="/global/logo.png"
              alt="Logo"
              className={isOpen ? "rotated" : ""}
            />
          </Link>
          <button className="menu-toggle" aria-label="Toggle menu">
            <div
              ref={hamburgerMenuRef}
              className={`menu-hamburger-icon ${isOpen ? "open" : ""}`}
            >
              <span className="menu-item"></span>
              <span className="menu-item"></span>
            </div>
          </button>
        </div>
        <div className="menu-overlay" ref={menuOverlayRef}>
          <nav className="menu-nav">
            <ul>
              <li key="Home" ref={(el) => (menuItemsRef.current[0] = el)}>
                <Link to="/" onClick={handleMenuLinkClick}>Home</Link>
              </li>
              <li key="Work" ref={(el) => (menuItemsRef.current[1] = el)}>
                <Link to="/work" onClick={handleMenuLinkClick}>Work</Link>
              </li>
              <li key="About" ref={(el) => (menuItemsRef.current[2] = el)}>
                <Link to="/about" onClick={handleMenuLinkClick}>About</Link>
              </li>
              <li key="Contact" ref={(el) => (menuItemsRef.current[3] = el)}>
                <Link to="/contact" onClick={handleMenuLinkClick}>Contact</Link>
              </li>
              <li key="FAQ" ref={(el) => (menuItemsRef.current[4] = el)}>
                <Link to="/faq" onClick={handleMenuLinkClick}>FAQ</Link>
              </li>
            </ul>
          </nav>

          <div className="menu-footer" ref={menuFooterRef}>
            <div className="menu-social">
              <a href="https://www.instagram.com/appaji_dheeraj/">
                <span>&#9654;</span> Instagram
              </a>
              <a href="https://www.linkedin.com/in/appaji-dheeraj/">
                <span>&#9654;</span> LinkedIn
              </a>
            </div>
            <div className="menu-time" ref={timeRef}></div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;