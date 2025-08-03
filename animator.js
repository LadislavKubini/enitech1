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

// Registruje jeden konkrétny prvok (typicky podla id)
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

// Registruje viacero prvkov podľa selektora (typicky class name)
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

//***************************************************************************************
// Ked sa "skoci" na stranku s target id v url, napr. indexKontakt.html#id-kontakt3-Deak,
// tak sa vykona animacia css na prvku <div id="id-kontakt3-Deak">
function highlightContact(targetId, options) {
  options = options || {};
  var animationClass = options.animationClass || 'highlight-once';
  var delayMs = typeof options.delayMs === 'number' ? options.delayMs : 100;

  if (window.location.hash !== '#' + targetId) return;
  var el = document.getElementById(targetId);
  if (!el) return;

  // reštart animácie
  setTimeout(function() {
    el.classList.remove(animationClass);
    void el.offsetWidth; // force reflow na reset animácie
    el.classList.add(animationClass);
  }, delayMs);
}

