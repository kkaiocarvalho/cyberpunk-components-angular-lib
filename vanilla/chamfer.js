/* CHAMFER UI — comportamentos mínimos (vanilla, sem dependências).
   Tudo funciona por data-attributes; chame ChamferUI.init(root) após renderizar
   conteúdo novo (ex.: ngAfterViewInit no Angular). */
(function (global) {
  "use strict";

  function tabs(root) {
    root.querySelectorAll("[data-cf-tabs]").forEach(function (box) {
      if (box.__cf) return; box.__cf = 1;
      var list = box.querySelectorAll('[role="tab"]');
      function select(tab) {
        list.forEach(function (t) {
          var on = t === tab;
          t.setAttribute("aria-selected", on ? "true" : "false");
          t.tabIndex = on ? 0 : -1;
          var panel = document.getElementById(t.getAttribute("aria-controls"));
          if (panel) panel.hidden = !on;
        });
      }
      list.forEach(function (t, i) {
        t.addEventListener("click", function () { select(t); });
        t.addEventListener("keydown", function (e) {
          var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          var n = list[(i + d + list.length) % list.length];
          n.focus(); select(n);
        });
      });
    });
  }

  function dialogs(root) {
    root.querySelectorAll("[data-cf-open]").forEach(function (btn) {
      if (btn.__cf) return; btn.__cf = 1;
      btn.addEventListener("click", function () {
        var d = document.getElementById(btn.getAttribute("data-cf-open"));
        if (d && d.showModal) d.showModal();
      });
    });
    root.querySelectorAll("dialog.cf-dialog").forEach(function (d) {
      if (d.__cf) return; d.__cf = 1;
      d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
      d.querySelectorAll("[data-cf-close]").forEach(function (b) {
        b.addEventListener("click", function () { d.close(b.value || ""); });
      });
    });
  }

  function steppers(root) {
    root.querySelectorAll("[data-cf-stepper]").forEach(function (s) {
      if (s.__cf) return; s.__cf = 1;
      var out = s.querySelector(".cf-stepper__value");
      var min = +s.dataset.min || 0, max = +(s.dataset.max || 20);
      var dec = s.querySelector("[data-dec]"), inc = s.querySelector("[data-inc]");
      function set(v) {
        v = Math.max(min, Math.min(max, v));
        out.textContent = v; dec.disabled = v <= min; inc.disabled = v >= max;
        s.dispatchEvent(new CustomEvent("cf-change", { detail: v, bubbles: true }));
      }
      dec.addEventListener("click", function () { set(+out.textContent - 1); });
      inc.addEventListener("click", function () { set(+out.textContent + 1); });
      set(+out.textContent);
    });
  }

  function ranges(root) {
    root.querySelectorAll("input.cf-range").forEach(function (r) {
      if (r.__cf) return; r.__cf = 1;
      function paint() {
        var p = ((r.value - (r.min || 0)) / ((r.max || 100) - (r.min || 0))) * 100;
        r.style.setProperty("--val", p + "%");
        var o = r.dataset.output && document.getElementById(r.dataset.output);
        if (o) o.textContent = r.value;
      }
      r.addEventListener("input", paint); paint();
    });
  }

  function flash(root) {
    root.querySelectorAll("[data-cf-flash]").forEach(function (el) {
      if (el.__cfFlash) return; el.__cfFlash = 1;
      el.addEventListener("click", function () {
        el.classList.add("is-flash");
        setTimeout(function () { el.classList.remove("is-flash"); }, 140);
      });
    });
  }

  function toast(opts) {
    opts = opts || {};
    var host = document.querySelector(".cf-toaster");
    if (!host) {
      host = document.createElement("div");
      host.className = "cf-toaster cf-root";
      host.setAttribute("role", "status");
      host.setAttribute("aria-live", "polite");
      document.body.appendChild(host);
    }
    var el = document.createElement("div");
    el.className = "cf-alert cf-bracket" + (opts.variant ? " cf-alert--" + opts.variant : "");
    var t = document.createElement("p"); t.className = "cf-alert__title"; t.textContent = opts.title || "";
    var b = document.createElement("p"); b.className = "cf-alert__body"; b.textContent = opts.body || "";
    var txt = document.createElement("div"); txt.appendChild(t); if (opts.body) txt.appendChild(b);
    var mark = document.createElement("span"); mark.className = "cf-dot"; mark.style.marginTop = "6px"; mark.style.color = "var(--cf-bracket-color)";
    var x = document.createElement("button"); x.className = "cf-alert__close"; x.setAttribute("aria-label", "Fechar"); x.textContent = "×";
    el.append(mark, txt, x);
    function remove() { el.classList.add("is-leaving"); setTimeout(function () { el.remove(); }, 260); }
    x.addEventListener("click", remove);
    host.appendChild(el);
    setTimeout(remove, opts.duration || 4200);
    return el;
  }

  function init(root) {
    root = root || document;
    tabs(root); dialogs(root); steppers(root); ranges(root); flash(root);
  }

  global.ChamferUI = { init: init, toast: toast };
  if (document.readyState !== "loading") init(); else document.addEventListener("DOMContentLoaded", function () { init(); });
})(window);
