const imageCache = new Set();

export const aboutDeskImageSources = [
  "/about/desk/music.png",
  "/about/desk/appicon.png",
  "/about/desk/cd.png",
  "/about/desk/cursor.png",
  "/about/desk/dialog.png",
  "/about/desk/folder.png",
  "/about/desk/plant.png",
  "/about/desk/email.png",
  "/about/desk/painting.png",
  "/about/desk/coffee.png",
];

const preloadImage = (src, timeoutMs) => {
  if (!src || imageCache.has(src)) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const img = new Image();
    let settled = false;

    const settle = () => {
      if (settled) {
        return;
      }

      settled = true;
      imageCache.add(src);
      resolve();
    };

    const timeoutId = window.setTimeout(settle, timeoutMs);

    img.onload = () => {
      window.clearTimeout(timeoutId);
      settle();
    };

    img.onerror = () => {
      window.clearTimeout(timeoutId);
      settle();
    };

    img.src = src;
  });
};

export const preloadImages = (sources = [], timeoutMs = 4000) => {
  const uniqueSources = [...new Set(sources)];
  return Promise.all(uniqueSources.map((src) => preloadImage(src, timeoutMs)));
};
