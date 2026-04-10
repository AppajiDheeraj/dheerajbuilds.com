export const routeLoaders = {
  "/": () => import("../pages/Home/Home"),
  "/work": () => import("../pages/Work/Work"),
  "/sample-project": () => import("../pages/Project/Project"),
  "/about": () => import("../pages/About/About"),
  "/faq": () => import("../pages/FAQ/FAQ"),
  "/contact": () => import("../pages/Contact/Contact"),
};

const loadedRoutes = new Set();

export const preloadRoute = (path) => {
  const loadRoute = routeLoaders[path];

  if (!loadRoute || loadedRoutes.has(path)) {
    return Promise.resolve();
  }

  return loadRoute()
    .then(() => {
      loadedRoutes.add(path);
    })
    .catch(() => {
      // Ignore preload failures so navigation can still retry the real load path.
    });
};

export const preloadAllRoutes = () => {
  return Promise.all(Object.keys(routeLoaders).map((path) => preloadRoute(path)));
};