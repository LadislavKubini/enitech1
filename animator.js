var Animator = {}; // Globálny objekt Animator
Animator.observer = null;

// Inicializácia IntersectionObservera
Animator.initObserver = function () {
  if (Animator.observer !== null) return;

  Animator.observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const className = el.getAttribute("data-animation-class");
        if (className) {
          el.classList.add(className);
          Animator.observer.unobserve(el); // Animuj len raz
        }
      }
    });
  }, { threshold: 0.3 });
};

// Registruje jeden konkrétny prvok
Animator.register = function (selector, animationClassName) {
  const el = document.querySelector(selector);
  if (!el) {
    console.warn("Animator: Nenájdený prvok pre selektor:", selector);
    return;
  }
  Animator.initObserver();
  el.setAttribute("data-animation-class", animationClassName);

  // if (animationClassName === "animate-width-grow") {
  //   el.style.width = "0";
  //   el.style.overflow = "hidden";
  // }

  Animator.observer.observe(el);
};

// Registruje viacero prvkov podľa selektora
Animator.registerAll = function (selector, animationClassName) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) {
    console.warn("Animator: Nenájdené prvky pre selektor:", selector);
    return;
  }

  Animator.initObserver();

  elements.forEach((el) => {
    el.setAttribute("data-animation-class", animationClassName);

//    if (animationClassName === "animate-width-grow") {
//      el.style.width = "0";
//      el.style.overflow = "hidden";
//    }

    Animator.observer.observe(el);
  });
};
