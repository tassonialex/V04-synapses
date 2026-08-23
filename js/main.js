(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  var scrim = document.querySelector("[data-nav-scrim]");
  if (!toggle || !nav) return;

  var isOpen = false;
  var mq = window.matchMedia("(min-width: 900px)");
  if (!mq.matches) nav.setAttribute("aria-hidden", "true");

  function getFocusable() {
    return Array.prototype.slice.call(
      nav.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    );
  }

  function onKeydown(event) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "Tab") {
      var focusable = getFocusable();
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function setOpen(open) {
    if (open === isOpen) return;
    isOpen = open;

    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu");
    nav.classList.toggle("is-open", open);
    if (mq.matches) {
      nav.removeAttribute("aria-hidden");
    } else {
      nav.setAttribute("aria-hidden", open ? "false" : "true");
    }
    document.body.classList.toggle("nav-open", open);
    document.documentElement.classList.toggle("nav-open", open);
    if (scrim) scrim.classList.toggle("is-open", open);

    if (open) {
      document.addEventListener("keydown", onKeydown);
      var focusable = getFocusable();
      if (focusable.length) focusable[0].focus();
    } else {
      document.removeEventListener("keydown", onKeydown);
      toggle.focus();
    }
  }

  toggle.addEventListener("click", function () {
    setOpen(!isOpen);
  });

  if (scrim) {
    scrim.addEventListener("click", function () {
      setOpen(false);
    });
  }

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });

  function onBreakpoint(e) {
    if (e.matches) {
      setOpen(false);
    } else if (!isOpen) {
      nav.setAttribute("aria-hidden", "true");
    }
  }
  if (mq.addEventListener) mq.addEventListener("change", onBreakpoint);
  else mq.addListener(onBreakpoint);
})();

/* Case study carousel */
(function () {
  var carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;

  var viewport = carousel.querySelector(".carousel-viewport");
  var track = carousel.querySelector("[data-carousel-track]");
  var slides = Array.prototype.slice.call(track.children);
  var prevBtn = carousel.querySelector("[data-carousel-prev]");
  var nextBtn = carousel.querySelector("[data-carousel-next]");
  var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-carousel-dot]"));
  var index = 0;
  var autoplayDelay = 3000;
  var autoplayTimer = null;
  var autoplayStopped = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function update() {
    var active = slides[index];
    var offset = viewport.clientWidth / 2 - (active.offsetLeft + active.offsetWidth / 2);
    track.style.transform = "translateX(" + offset + "px)";
    slides.forEach(function (slide, i) {
      var isActive = i === index;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", isActive ? "false" : "true");
    });
    dots.forEach(function (dot, i) {
      if (i === index) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    update();
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function stopAutoplayForGood() {
    autoplayStopped = true;
    stopAutoplay();
  }

  function startAutoplay() {
    if (autoplayStopped) return;
    stopAutoplay();
    autoplayTimer = window.setInterval(function () {
      goTo(index + 1);
    }, autoplayDelay);
  }

  prevBtn.addEventListener("click", function () {
    stopAutoplayForGood();
    goTo(index - 1);
  });
  nextBtn.addEventListener("click", function () {
    stopAutoplayForGood();
    goTo(index + 1);
  });
  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      stopAutoplayForGood();
      goTo(i);
    });
  });

  carousel.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      stopAutoplayForGood();
      goTo(index - 1);
    }
    if (event.key === "ArrowRight") {
      stopAutoplayForGood();
      goTo(index + 1);
    }
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", function () {
    if (!carousel.contains(document.activeElement)) startAutoplay();
  });

  var touchStartX = null;
  track.addEventListener(
    "touchstart",
    function (event) {
      stopAutoplayForGood();
      touchStartX = event.touches[0].clientX;
    },
    { passive: true }
  );
  track.addEventListener(
    "touchend",
    function (event) {
      if (touchStartX === null) return;
      var deltaX = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(deltaX) > 40) {
        if (deltaX < 0) goTo(index + 1);
        else goTo(index - 1);
      }
      touchStartX = null;
    },
    { passive: true }
  );

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(update, 150);
  });

  update();
  startAutoplay();
})();

/* Case study PDF modal */
(function () {
  var modal = document.querySelector("[data-pdf-modal]");
  if (!modal) return;

  var overlay = modal.querySelector("[data-pdf-modal-overlay]");
  var dialog = modal.querySelector("[data-pdf-modal-dialog]");
  var closeBtn = modal.querySelector("[data-pdf-modal-close]");
  var titleEl = modal.querySelector("[data-pdf-modal-title]");
  var frame = modal.querySelector("[data-pdf-modal-frame]");
  var openLink = modal.querySelector("[data-pdf-modal-open]");
  var downloadLink = modal.querySelector("[data-pdf-modal-download]");
  var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-pdf-src]"));
  var lastFocused = null;

  function getFocusable() {
    return Array.prototype.slice.call(
      dialog.querySelectorAll('a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])')
    );
  }

  function onKeydown(event) {
    if (event.key === "Escape") {
      closeModal();
      return;
    }
    if (event.key === "Tab") {
      var focusable = getFocusable();
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function openModal(src, title) {
    lastFocused = document.activeElement;
    titleEl.textContent = title || "Case study";
    frame.src = src;
    openLink.href = src;
    downloadLink.href = src;
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    dialog.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("no-scroll");
    frame.src = "";
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      openModal(trigger.getAttribute("data-pdf-src"), trigger.getAttribute("data-pdf-title"));
    });
  });

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
})();

/* Contact form validation (front-end only, no real submission) */
(function () {
  var form = document.querySelector("[data-contact-form]");
  if (!form) return;

  var status = form.querySelector("[data-form-status]");
  var requiredFields = Array.prototype.slice.call(form.querySelectorAll("[required]"));

  function setFieldError(field, message) {
    var wrapper = field.closest(".form-field");
    var errorEl = wrapper ? wrapper.querySelector(".field-error") : null;
    if (message) {
      if (wrapper) wrapper.setAttribute("data-invalid", "true");
      field.setAttribute("aria-invalid", "true");
      if (errorEl) {
        errorEl.textContent = message;
        if (errorEl.id) field.setAttribute("aria-describedby", errorEl.id);
      }
    } else {
      if (wrapper) wrapper.removeAttribute("data-invalid");
      field.removeAttribute("aria-invalid");
      if (errorEl) errorEl.textContent = "";
    }
  }

  function validateField(field) {
    if (field.type === "checkbox") {
      if (!field.checked) {
        setFieldError(field, "Devi accettare il consenso per proseguire.");
        return false;
      }
      setFieldError(field, "");
      return true;
    }
    if (!field.value.trim()) {
      setFieldError(field, field.type === "email" ? "Inserisci il tuo indirizzo email." : "Questo campo è obbligatorio.");
      return false;
    }
    if (field.type === "email" && !field.checkValidity()) {
      setFieldError(field, "Inserisci un indirizzo email valido.");
      return false;
    }
    setFieldError(field, "");
    return true;
  }

  requiredFields.forEach(function (field) {
    field.addEventListener("blur", function () {
      validateField(field);
    });
    field.addEventListener("input", function () {
      var wrapper = field.closest(".form-field");
      if (wrapper && wrapper.getAttribute("data-invalid") === "true") validateField(field);
    });
    field.addEventListener("change", function () {
      var wrapper = field.closest(".form-field");
      if (field.type === "checkbox" && wrapper && wrapper.getAttribute("data-invalid") === "true") {
        validateField(field);
      }
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (status) status.textContent = "";

    var isValid = true;
    var firstInvalid = null;
    requiredFields.forEach(function (field) {
      var ok = validateField(field);
      if (!ok) {
        isValid = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (!isValid) {
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    if (status) {
      status.textContent =
        "Modulo compilato correttamente. Questa è una simulazione locale: nessun dato è stato inviato o salvato.";
    }
  });
})();

/* Mobile header theme — l'header (già sticky via CSS) cambia tema
   chiaro/scuro in base alla sezione che scorre sotto di esso, solo
   fino al breakpoint mobile esistente (899px). Nessuno scroll
   listener: si usa IntersectionObserver, e non si tocca la logica
   del menu (toggle/overlay/focus/Esc) definita più sopra. */
(function () {
  var header = document.querySelector(".site-header");
  var main = document.querySelector("main");
  var footer = document.querySelector(".site-footer");
  if (!header || !main || !("IntersectionObserver" in window)) return;

  var DARK_SECTION = ".hero, .page-hero, .problem, .compare, .site-footer";
  var sections = Array.prototype.slice
    .call(main.children)
    .filter(function (el) {
      return el.tagName === "SECTION";
    });
  if (footer) sections.push(footer);
  if (!sections.length) return;

  var mq = window.matchMedia("(max-width: 899px)");
  var observer = null;

  function headerHeight() {
    var raw = getComputedStyle(document.documentElement).getPropertyValue("--header-h");
    var value = parseFloat(raw);
    return isNaN(value) ? 72 : value;
  }

  function applyTheme(target) {
    if (!target) return;
    header.setAttribute("data-theme", target.matches(DARK_SECTION) ? "dark" : "light");
  }

  function onIntersect(entries) {
    var visible = entries.filter(function (entry) {
      return entry.isIntersecting;
    });
    if (!visible.length) return;
    visible.sort(function (a, b) {
      return a.boundingClientRect.top - b.boundingClientRect.top;
    });
    applyTheme(visible[0].target);
  }

  function start() {
    if (observer) return;
    applyTheme(sections[0]);
    observer = new IntersectionObserver(onIntersect, {
      rootMargin: "-" + headerHeight() + "px 0px -85% 0px",
      threshold: 0,
    });
    sections.forEach(function (el) {
      observer.observe(el);
    });
  }

  function stop() {
    if (!observer) return;
    observer.disconnect();
    observer = null;
    header.setAttribute("data-theme", "dark");
  }

  function sync(e) {
    if (e.matches) start();
    else stop();
  }

  sync(mq);
  if (mq.addEventListener) mq.addEventListener("change", sync);
  else mq.addListener(sync);
})();
