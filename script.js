const categories = [...document.querySelectorAll(".category")];

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-active", entry.isIntersecting);
    });
  },
  {
    root: null,
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.04,
  }
);

categories.forEach((category) => observer.observe(category));
