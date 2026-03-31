import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import NavBar from "./components/NavBar/NavBar";
import Preloader from "./components/Preloader/Preloader";

import Home from "./pages/Home/Home";
import Work from "./pages/Work/Work";
import Project from "./pages/Project/Project";
import About from "./pages/About/About";
import FAQ from "./pages/FAQ/FAQ";
import Contact from "./pages/Contact/Contact";

import { AnimatePresence } from "framer-motion";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1400);
  }, [pathname]);

  return null;
}

function App() {
  const location = useLocation();
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);
  const previousTitleRef = useRef(document.title);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        previousTitleRef.current = document.title;
        document.title = "Tab's Lonely";
        return;
      }

      document.title = previousTitleRef.current;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.title = previousTitleRef.current;
    };
  }, []);

  const handlePreloaderComplete = () => {
    setIsPreloaderComplete(true);
  };

  return (
    <>
      {!isPreloaderComplete && (
        <Preloader onAnimationComplete={handlePreloaderComplete} />
      )}
      <div className={`app-shell ${isPreloaderComplete ? "ready" : ""}`}>
        <ScrollToTop />
        <NavBar />
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={<Home isPreloaderComplete={isPreloaderComplete} />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/work" element={<Work />} />
            <Route path="/sample-project" element={<Project />} />
          </Routes>
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
