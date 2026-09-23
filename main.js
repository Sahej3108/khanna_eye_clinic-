document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("nav");

  // Hamburger
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    nav.classList.toggle("open");
  });

  // Eye Treatments dropdown
  document.querySelectorAll(".dropdown-toggle").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        this.parentElement.classList.toggle("open");
      }
    });
  });

  // Close menu on normal links
  document.querySelectorAll("#navMenu a").forEach((link) => {
    link.addEventListener("click", () => {
      if (!link.parentElement.classList.contains("has-dropdown")) {
        hamburger.classList.remove("active");
        nav.classList.remove("open");
      }
    });
  });

  /* ---- STICKY HEADER ---- */

  /* ---- STICKY HEADER ---- */
  var header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* ---- HERO SLIDER ---- */
  var slides = document.querySelectorAll('.slide');
  var dots   = document.querySelectorAll('.slider-dots .dot');
  var sliderPrev = document.getElementById('sliderPrev');
  var sliderNext = document.getElementById('sliderNext');
  var currentSlide = 0;
  var sliderTimer = null;

  function goToSlide(index) {
    if (!slides.length) return;
    slides[currentSlide].classList.remove('active');
    slides[currentSlide].style.zIndex = 1;
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].style.zIndex = 3;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  function startSlider() {
    sliderTimer = setInterval(function () { goToSlide(currentSlide + 1); }, 5000);
  }

  function resetSlider() { clearInterval(sliderTimer); startSlider(); }

  if (sliderPrev) sliderPrev.addEventListener('click', function () { goToSlide(currentSlide - 1); resetSlider(); });
  if (sliderNext) sliderNext.addEventListener('click', function () { goToSlide(currentSlide + 1); resetSlider(); });

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goToSlide(parseInt(this.dataset.index || 0));
      resetSlider();
    });
  });

  if (slides.length) startSlider();

  /* ---- REVIEWS SLIDER ---- */
  var reviewsTrack = document.getElementById('reviewsTrack');
  var reviewDotBtns = document.querySelectorAll('.reviews-controls .slider-dot-btn');
  var reviewGroups = document.querySelectorAll('#reviewsTrack .review-slide-group');
  var totalGroups = reviewGroups.length;
  var currentReview = 0;

  function goToReview(index) {
    if (!reviewsTrack || !totalGroups) return;
    if (index < 0) index = totalGroups - 1;
    if (index >= totalGroups) index = 0;
    currentReview = index;
    reviewsTrack.style.transform = 'translateX(-' + (index * (100 / totalGroups)) + '%)';
    reviewDotBtns.forEach(function (d, i) {
      d.classList.toggle('active', i === index);
    });
  }

  reviewDotBtns.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goToReview(i); });
  });

  if (totalGroups) {
    setInterval(function () { goToReview(currentReview + 1); }, 5000);
  }

  /* ---- FAQ ACCORDION ---- */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item   = this.closest('.faq-item');
      var answer = item.querySelector('.faq-answer');
      var isOpen = this.classList.contains('open');

      document.querySelectorAll('.faq-question.open').forEach(function (q) {
        q.classList.remove('open');
        var a = q.closest('.faq-item').querySelector('.faq-answer');
        if (a) a.classList.remove('open');
      });

      if (!isOpen && answer) {
        this.classList.add('open');
        answer.classList.add('open');
      }
    });
  });

  /* ---- ANIMATED COUNTERS ---- */
  function formatCount(val, target) {
    if (target >= 100000) {
      var lakhs = val / 100000;
      return (Number.isInteger(lakhs) ? lakhs : parseFloat(lakhs.toFixed(1))) + ' Lakhs';
    }
    return val.toLocaleString('en-IN');
  }

  function animateCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';
    var target    = parseInt(el.getAttribute('data-target'), 10);
    var duration  = 2000;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased    = 1 - (1 - progress) * (1 - progress);
      el.textContent = formatCount(Math.round(eased * target), target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatCount(target, target);
      }
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('.counter');
  if (counters.length) {
    var cObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) animateCounter(entry.target);
      });
    }, { threshold: 0.2 });
    counters.forEach(function (el) { cObserver.observe(el); });
  }

  /* ---- APPOINTMENT FORM (contact section) ---- */
  var apptForm = document.getElementById('appointmentForm');
  if (apptForm) {
    apptForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name    = document.getElementById('cf-name');
      var phone   = document.getElementById('cf-phone');
      var treat   = document.getElementById('cf-treatment');

      var isValid = true;

      /* Name */
      if (!name || !name.value.trim()) {
        if (name) name.style.borderColor = '#e53935';
        isValid = false;
      } else {
        name.style.borderColor = '#2e7d32';
      }

      /* Phone — must be 10 digits */
      var phoneWrap = document.getElementById('cf-phone-wrap');
      if (!phone || phone.value.trim().length !== 10) {
        if (phoneWrap) phoneWrap.style.borderColor = '#e53935';
        isValid = false;
      } else {
        if (phoneWrap) phoneWrap.style.borderColor = '#2e7d32';
      }

      /* Treatment */
      if (!treat || !treat.value) {
        if (treat) treat.style.borderColor = '#e53935';
        isValid = false;
      } else {
        treat.style.borderColor = '#2e7d32';
      }

      if (!isValid) return;

      /* Success */
      var btn = this.querySelector('button[type="submit"]');
      btn.textContent = "Booked! We'll contact you soon.";
      btn.style.background = '#1b5e20';
      btn.disabled = true;

      setTimeout(function () {
        btn.textContent = 'Make an Appointment';
        btn.style.background = '';
        btn.disabled = false;
        apptForm.reset();
        if (name) name.style.borderColor = '';
        if (phoneWrap) phoneWrap.style.borderColor = '';
        if (treat) treat.style.borderColor = '';
      }, 3000);
    });

    /* Phone: only allow numbers */
    var phoneInput = document.getElementById('cf-phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 10);
      });
    }
  }

  /* ---- APPOINTMENT MODAL ---- */
  setTimeout(function() {
    var modalOverlay = document.getElementById('modalOverlay');
    var modalClose   = document.getElementById('modalClose');
    var modalForm    = document.getElementById('modalForm');

    if (!modalOverlay) return;

    function openModal() {
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.open-modal').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openModal();
      });
    });

    if (modalClose) {
      modalClose.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      });
    }

    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeModal();
    });

    if (modalForm) {
      modalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var btn = this.querySelector('button[type="submit"]');
        btn.textContent = "Booked! We'll contact you soon.";
        btn.style.background = '#1b5e20';
        btn.disabled = true;
        setTimeout(function() {
          btn.textContent = 'Make an Appointment';
          btn.style.background = '';
          btn.disabled = false;
          modalForm.reset();
          closeModal();
        }, 3000);
      });
    }
  }, 100);

  /* ---- TREATMENTS MOBILE ACCORDION CLICK LOGIC ---- */


document.querySelectorAll('.tacc-header').forEach(function(header){

    header.onclick = function(){

        const body = this.nextElementSibling;

        body.classList.toggle('open');
        this.classList.toggle('open');

        console.log(body.className);
    }

});
});

//blog

/* Khanna Eye Centre - blog scripts (no dependencies) */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---- Logo fallback: show a text wordmark if the logo image is missing ---- */
  var logo = $(".brand img");
  if (logo) {
    var fallback = function () { logo.parentNode.classList.add("no-logo"); };
    logo.addEventListener("error", fallback);
    if (logo.complete && logo.naturalWidth === 0) fallback();
  }

  /* ---- Mobile menu + dropdowns ---- */
  var toggle = $(".menu-toggle"), nav = $(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
  }
  $$(".has-sub > button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var li = btn.parentNode, open = li.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
    });
  });

  /* ---- Appointment dialog (sends the details to WhatsApp) ---- */
  var dlg = $("#bookDialog");
  if (dlg) {
    $$("[data-book]").forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.preventDefault();
        if (nav) nav.classList.remove("open");
        if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
      });
    });
    $$("[data-close]", dlg).forEach(function (b) {
      b.addEventListener("click", function () { dlg.close(); });
    });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    var form = $("form", dlg), err = $(".error", dlg);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements, mobile = f.mobile.value.replace(/\D/g, "");
      if (!f.name.value.trim()) { err.textContent = "Enter your name."; return; }
      if (mobile.length !== 10) { err.textContent = "Enter a valid 10-digit mobile number."; return; }
      if (!f.treatment.value) { err.textContent = "Choose the treatment you need."; return; }
      err.textContent = "";
      var msg = "Hello Khanna Eye Centre, I would like to book an appointment.\n" +
        "Name: " + f.name.value.trim() + "\n" +
        "Mobile: +91 " + mobile + "\n" +
        (f.email.value.trim() ? "Email: " + f.email.value.trim() + "\n" : "") +
        "Treatment: " + f.treatment.value + "\n" +
        (f.time.value ? "Preferred time: " + f.time.value : "");
      window.open("https://wa.me/919354409885?text=" + encodeURIComponent(msg), "_blank", "noopener");
      form.reset();
      dlg.close();
    });
  }

  /* ---- Listing: category chips + search ---- */
  var grid = $("#blogGrid");
  if (grid) {
    var cards = $$(".post-card", grid), chips = $$(".chip"), input = $("#blogSearch");
    var count = $("#resultCount"), empty = $("#emptyState"), activeCat = "all";
    var apply = function () {
      var q = input.value.trim().toLowerCase(), shown = 0;
      cards.forEach(function (c) {
        var okCat = activeCat === "all" || c.dataset.cat === activeCat;
        var okQ = !q || c.dataset.text.indexOf(q) > -1;
        c.hidden = !(okCat && okQ);
        if (!c.hidden) shown++;
      });
      grid.classList.toggle("is-filtering", activeCat !== "all" || !!q);
      count.textContent = shown + (shown === 1 ? " article" : " articles");
      empty.classList.toggle("show", shown === 0);
    };
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        activeCat = chip.dataset.cat;
        chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip); });
        apply();
      });
    });
    input.addEventListener("input", apply);
    $("#resetFilters").addEventListener("click", function () {
      input.value = ""; activeCat = "all";
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c.dataset.cat === "all"); });
      apply();
    });
    apply();
  }

  /* ---- Article: reading progress bar ---- */
  var bar = $(".progress span"), article = $(".article");
  if (bar && article) {
    var onScroll = function () {
      var r = article.getBoundingClientRect(), total = r.height - window.innerHeight * 0.6;
      var done = Math.min(1, Math.max(0, (-r.top + 80) / total));
      bar.style.width = (done * 100) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Article: table of contents built from h2 headings ---- */
  var tocList = $("#toc");
  if (tocList) {
    var heads = $$(".article-body h2");
    if (heads.length < 3) { tocList.closest(".side-card").hidden = true; }
    heads.forEach(function (h, i) {
      if (!h.id) h.id = "s" + (i + 1);
      var li = document.createElement("li"), a = document.createElement("a");
      a.href = "#" + h.id; a.textContent = h.textContent; li.appendChild(a); tocList.appendChild(li);
    });
    if ("IntersectionObserver" in window) {
      var links = $$("a", tocList);
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            links.forEach(function (l) { l.classList.toggle("active", l.hash === "#" + en.target.id); });
          }
        });
      }, { rootMargin: "-90px 0px -65% 0px" });
      heads.forEach(function (h) { io.observe(h); });
    }
  }

  /* ---- Article: share buttons ---- */
  var url = window.location.href.split("#")[0], title = document.title;
  var wa = $("#shareWa"), fb = $("#shareFb"), tw = $("#shareX"), cp = $("#copyLink");
  if (wa) wa.href = "https://wa.me/?text=" + encodeURIComponent(title + " " + url);
  if (fb) fb.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url);
  if (tw) tw.href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(title) + "&url=" + encodeURIComponent(url);
  if (cp) {
    cp.addEventListener("click", function () {
      var done = function () { cp.textContent = "Link copied"; setTimeout(function () { cp.textContent = "Copy link"; }, 2000); };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done); else done();
    });
  }
})();

