const categories = [...document.querySelectorAll(".category")];

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-active", entry.isIntersecting);
    });
  },
  {
    root: null,
    rootMargin: "-34% 0px -38% 0px",
    threshold: 0,
  }
);

categories.forEach((category) => observer.observe(category));
