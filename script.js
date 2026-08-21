const categories = [...document.querySelectorAll(".category")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let frameRequested = false;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function categoryProgress(top, viewportHeight) {
  const enterPoint = viewportHeight * 0.78;
  const exitPoint = -viewportHeight * 0.46;

  return clamp((enterPoint - top) / (enterPoint - exitPoint), 0, 1);
}

function phasedProgress(progress) {
  const transformStart = 0.4;
  const transformEnd = 0.65;
  const holdEnd = 0.85;

  if (progress < transformStart) {
    return { image: 0, list: 0 };
  }

  if (progress < transformEnd) {
    const transition = (progress - transformStart) / (transformEnd - transformStart);
    return { image: transition, list: transition };
  }

  if (progress < holdEnd) {
    return { image: 1, list: 1 };
  }

  const exit = (progress - holdEnd) / (1 - holdEnd);
  return { image: 1 - exit, list: 1 - exit };
}

function updateCategory(category, viewportHeight) {
  const stage = category.querySelector(".category-stage");
  const visual = category.querySelector(".food-visual");
  const rect = category.getBoundingClientRect();
  const progress = categoryProgress(rect.top, viewportHeight);
  const phase = phasedProgress(progress);

  if (reducedMotion.matches) {
    category.classList.add("is-reduced-motion");
    category.classList.add("is-list-visible");
    category.style.setProperty("--image-x", "0px");
    category.style.setProperty("--image-y", "0px");
    category.style.setProperty("--image-scale", "1");
    category.style.setProperty("--list-opacity", "1");
    category.style.setProperty("--list-y", "0px");
    category.style.setProperty("--accent-opacity", "0");
    return;
  }

  category.classList.remove("is-reduced-motion");

  const stageWidth = stage.getBoundingClientRect().width;
  const initialSize = visual.offsetWidth;
  const finalSize = initialSize * 0.42;
  const edgeMargin = Math.max(12, stageWidth * 0.035);
  const finalLeft = stageWidth - finalSize - edgeMargin;
  const finalCenter = finalLeft + finalSize / 2;
  const imageX = (finalCenter - stageWidth / 2) * phase.image;
  const imageY = -Math.min(56, Math.max(24, stageWidth * 0.08)) * phase.image;
  const imageScale = 1 - 0.58 * phase.image;
  const listOpacity = phase.list;
  const listY = 18 * (1 - listOpacity);

  category.classList.toggle("is-list-visible", listOpacity > 0.01);
  category.style.setProperty("--image-x", `${imageX}px`);
  category.style.setProperty("--image-y", `${imageY}px`);
  category.style.setProperty("--image-scale", imageScale.toFixed(3));
  category.style.setProperty("--list-opacity", listOpacity.toFixed(3));
  category.style.setProperty("--list-y", `${listY.toFixed(1)}px`);
  category.style.setProperty("--accent-opacity", listOpacity.toFixed(3));
}

function updateCategories() {
  frameRequested = false;
  const viewportHeight = window.innerHeight;
  categories.forEach((category) => updateCategory(category, viewportHeight));
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
