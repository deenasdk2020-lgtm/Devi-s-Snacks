const categories = [...document.querySelectorAll(".category")];

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-active", entry.isIntersecting);
    });
  },
  {
    root: null,
    rootMargin: "6% 0px -14% 0px",
    threshold: 0.01,
  }
);

categories.forEach((category) => observer.observe(category));
