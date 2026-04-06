import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect, useRef, useState } from "react";

import NavBar from "./components/NavBar/NavBar";
import Preloader from "./components/Preloader/Preloader";

const Home = lazy(() => import("./pages/Home/Home"));
const Work = lazy(() => import("./pages/Work/Work"));
const Project = lazy(() => import("./pages/Project/Project"));
const About = lazy(() => import("./pages/About/About"));
const FAQ = lazy(() => import("./pages/FAQ/FAQ"));
const Contact = lazy(() => import("./pages/Contact/Contact"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Delay to next frame avoids fighting in-progress route transition paints.
    const id = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });

    return () => {
      cancelAnimationFrame(id);
    };
  }, [pathname]);

  return null;
}

function App() {
  const location = useLocation();
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);
  const previousTitleRef = useRef(document.title);

  useEffect(() => {
    // Preserve the original title so tab visibility messaging stays reversible.
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
        <Suspense fallback={null}>
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
        </Suspense>
      </div>
    </>
  );
}

export default App;
