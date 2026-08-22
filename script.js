const categories = [...document.querySelectorAll(".category")];
const footer = document.querySelector(".contact");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let frameRequested = false;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const easeInOut = (value) => value * value * (3 - 2 * value);

function pageEndProgress(viewportHeight) {
  if (!footer) {
    return 0;
  }

  const footerTop = footer.getBoundingClientRect().top;
  const closeStart = viewportHeight * 0.5;
  const closeEnd = viewportHeight * 0.12;

  return easeInOut(clamp((closeStart - footerTop) / (closeStart - closeEnd), 0, 1));
}

function categoryProgress(top, viewportHeight) {
  const enterPoint = viewportHeight * 0.78;
  const exitPoint = -viewportHeight * 0.46;

  return clamp((enterPoint - top) / (enterPoint - exitPoint), 0, 1);
}

function phasedProgress(progress) {
  const transformStart = 0.32;
  const transformEnd = 0.72;
  const holdEnd = 0.88;

  if (progress < transformStart) {
    return { image: 0, list: 0 };
  }

  if (progress < transformEnd) {
    const transition = easeInOut((progress - transformStart) / (transformEnd - transformStart));
    return { image: transition, list: transition };
  }

  if (progress < holdEnd) {
    return { image: 1, list: 1 };
  }

  const exit = easeInOut((progress - holdEnd) / (1 - holdEnd));
  return { image: 1 - exit, list: 1 - exit };
}

function updateCategory(category, viewportHeight, endProgress) {
  const panel = category.querySelector(".menu-panel");
  const rect = category.getBoundingClientRect();
  const progress = categoryProgress(rect.top, viewportHeight);
  const phase = phasedProgress(progress);
  const pageEndVisibility = 1 - endProgress;

  if (reducedMotion.matches) {
    category.classList.add("is-transforming");
    category.classList.add("is-reduced-motion");
    category.classList.toggle("is-list-visible", pageEndVisibility > 0.01);
    category.style.setProperty("--image-x", "0px");
    category.style.setProperty("--image-y", "0px");
    category.style.setProperty("--image-scale", "1");
    category.style.setProperty("--list-opacity", pageEndVisibility.toFixed(3));
    category.style.setProperty("--list-y", `${(18 * endProgress).toFixed(1)}px`);
    category.style.setProperty("--list-height", `${panel.scrollHeight}px`);
    category.style.setProperty("--accent-opacity", "0");
    return;
  }

  category.classList.remove("is-reduced-motion");
  category.classList.toggle("is-transforming", phase.image > 0.01);

  const imageX = 0;
  const imageY = 0;
  const imageScale = 1;
  const listOpacity = phase.list * pageEndVisibility;
  const listY = 18 * (1 - listOpacity);
  const listHeight = panel.scrollHeight;

  category.classList.toggle("is-list-visible", listOpacity > 0.01);
  category.style.setProperty("--image-x", `${imageX}px`);
  category.style.setProperty("--image-y", `${imageY}px`);
  category.style.setProperty("--image-scale", imageScale.toFixed(3));
  category.style.setProperty("--list-opacity", listOpacity.toFixed(3));
  category.style.setProperty("--list-y", `${listY.toFixed(1)}px`);
  category.style.setProperty("--list-height", `${listHeight}px`);
  category.style.setProperty("--accent-opacity", listOpacity.toFixed(3));
}

function updateCategories() {
  frameRequested = false;
  const viewportHeight = window.innerHeight;
  const endProgress = pageEndProgress(viewportHeight);
  categories.forEach((category) => updateCategory(category, viewportHeight, endProgress));
}

function requestCategoryUpdate() {
  if (!frameRequested) {
    frameRequested = true;
    window.requestAnimationFrame(updateCategories);
  }
}

window.addEventListener("scroll", requestCategoryUpdate, { passive: true });
window.addEventListener("resize", requestCategoryUpdate);
reducedMotion.addEventListener("change", requestCategoryUpdate);
updateCategories();
