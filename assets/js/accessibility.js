/**
 * Global accessibility: font size, dark mode, speaker (read aloud).
 * Works across all pages; preferences persist in localStorage.
 */
(function () {
  "use strict";

  var STORAGE_KEY_FONT = "im_fontSize";
  var STORAGE_KEY_DARK = "im_darkMode";
  var STORAGE_KEY_SPEAKER = "im_speakerOn";
  var MIN_LEVEL = -2;
  var MAX_LEVEL = 2;
  var DEFAULT_LEVEL = 0;
  var STEP = 0.1; // 90%, 100%, 110%, 120%, 130%

  var speechSynth = typeof window.speechSynthesis !== "undefined" ? window.speechSynthesis : null;
  var currentUtterance = null;
  var speakerCheckbox = null;

  function getStoredFontLevel() {
    try {
      var v = localStorage.getItem(STORAGE_KEY_FONT);
      if (v !== null) {
        var n = parseInt(v, 10);
        if (!isNaN(n) && n >= MIN_LEVEL && n <= MAX_LEVEL) return n;
      }
    } catch (e) {}
    return DEFAULT_LEVEL;
  }

  function setStoredFontLevel(level) {
    try {
      localStorage.setItem(STORAGE_KEY_FONT, String(level));
    } catch (e) {}
  }

  function getStoredDarkMode() {
    try {
      var v = localStorage.getItem(STORAGE_KEY_DARK);
      return v === "1" || v === "true";
    } catch (e) {}
    return false;
  }

  function setStoredDarkMode(on) {
    try {
      localStorage.setItem(STORAGE_KEY_DARK, on ? "1" : "0");
    } catch (e) {}
  }

  function getStoredSpeakerOn() {
    try {
      var v = localStorage.getItem(STORAGE_KEY_SPEAKER);
      return v === "1" || v === "true";
    } catch (e) {}
    return false;
  }

  function setStoredSpeakerOn(on) {
    try {
      localStorage.setItem(STORAGE_KEY_SPEAKER, on ? "1" : "0");
    } catch (e) {}
  }

  function applyFontSize(level) {
    level = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, level));
    var percent = 100 + level * (100 * STEP);
    document.documentElement.style.fontSize = percent + "%";
    setStoredFontLevel(level);
  }

  function applyDarkMode(on) {
    if (on) {
      document.body.classList.add("darkmode");
      var icon = document.getElementById("darkmode");
      if (icon) {
        icon.classList.remove("fa-moon-o");
        icon.classList.add("fa-sun-o");
      }
    } else {
      document.body.classList.remove("darkmode");
      var iconEl = document.getElementById("darkmode");
      if (iconEl) {
        iconEl.classList.remove("fa-sun-o");
        iconEl.classList.add("fa-moon-o");
      }
    }
    setStoredDarkMode(on);
  }

  function getVisibleText(node) {
    if (!node) return "";
    var skip = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, IFRAME: 1 };
    if (skip[node.nodeName]) return "";
    if (node.nodeType === 3) return node.textContent.replace(/\s+/g, " ").trim();
    if (node.nodeType !== 1) return "";
    var style = window.getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden") return "";
    var text = "";
    for (var i = 0; i < node.childNodes.length; i++) {
      text += getVisibleText(node.childNodes[i]);
      if (i < node.childNodes.length - 1 && node.childNodes[i].nodeType === 1) text += " ";
    }
    if (node.tagName === "P" || node.tagName === "DIV" || node.tagName === "BR" || node.tagName === "LI") text += " ";
    return text;
  }

  function readText(element) {
    if (!speechSynth) {
      try { alert("Text-to-speech is not supported in this browser."); } catch (e) {}
      return;
    }
    speechSynth.cancel();
    var el = element && element.nodeType ? element : document.body;
    var text = getVisibleText(el).replace(/\s+/g, " ").trim();
    if (!text) {
      try { alert("No text to read."); } catch (e) {}
      return;
    }
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = document.documentElement.lang || "en-IN";
    currentUtterance.rate = 0.9;
    currentUtterance.pitch = 1;
    speechSynth.speak(currentUtterance);
    if (speakerCheckbox) speakerCheckbox.checked = true;
    setStoredSpeakerOn(true);
  }

  function stopReading() {
    if (speechSynth) speechSynth.cancel();
    currentUtterance = null;
    if (speakerCheckbox) speakerCheckbox.checked = false;
    setStoredSpeakerOn(false);
  }

  function injectSpeakerIfMissing() {
    var gigw = document.querySelector(".gigw");
    if (!gigw || document.getElementById("screenReaderSwitch")) return;
    var li = document.createElement("li");
    li.innerHTML =
      '<a class="form-check form-switch aos-init aos-animate" data-aos="fade-up" data-aos-delay="600">' +
      '<label class="form-check-label" for="screenReaderSwitch">' +
      '<span class="d-inline-block" tabindex="0" data-toggle="tooltip" title="Screen Reader">' +
      '<i id="sound" class="t-Icon fa fa-volume-up"></i></span></label>' +
      '<input class="form-check-input" type="checkbox" role="switch" id="screenReaderSwitch"></a>';
    gigw.appendChild(li);
    li.querySelector("#screenReaderSwitch").addEventListener("change", function () {
      if (this.checked) readText(document.body);
      else stopReading();
    });
    speakerCheckbox = document.getElementById("screenReaderSwitch");
  }

  function bindClicks() {
    document.body.addEventListener("click", function (e) {
      var t = e.target;
      while (t && t !== document.body) {
        if (t.classList && t.classList.contains("btn-decrease")) {
          e.preventDefault();
          applyFontSize(getStoredFontLevel() - 1);
          return;
        }
        if (t.classList && t.classList.contains("btn-orig")) {
          e.preventDefault();
          applyFontSize(DEFAULT_LEVEL);
          return;
        }
        if (t.classList && t.classList.contains("btn-increase")) {
          e.preventDefault();
          applyFontSize(getStoredFontLevel() + 1);
          return;
        }
        var darkmodeIcon = document.getElementById("darkmode");
        var darkmodeBtn = darkmodeIcon && darkmodeIcon.closest ? darkmodeIcon.closest("a") : null;
        if (darkmodeBtn && (t === darkmodeIcon || t === darkmodeBtn || (darkmodeBtn.contains && darkmodeBtn.contains(t)))) {
          e.preventDefault();
          var on = !document.body.classList.contains("darkmode");
          applyDarkMode(on);
          return;
        }
        if (t.id === "screenReaderSwitch" || (t.closest && t.closest("label[for='screenReaderSwitch']"))) {
          e.preventDefault();
          e.stopImmediatePropagation();
          var cb = t.id === "screenReaderSwitch" ? t : document.getElementById("screenReaderSwitch");
          if (cb) {
            cb.checked = !cb.checked;
            speakerCheckbox = cb;
            if (cb.checked) readText(document.body);
            else stopReading();
          }
          return;
        }
        t = t.parentElement;
      }
    }, true);
  }

  function init() {
    applyFontSize(getStoredFontLevel());
    applyDarkMode(getStoredDarkMode());
    injectSpeakerIfMissing();
    speakerCheckbox = document.getElementById("screenReaderSwitch");
    if (speakerCheckbox && getStoredSpeakerOn()) {
      speakerCheckbox.checked = true;
      readText(document.body);
    }
    bindClicks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.readText = readText;
  window.stopReading = stopReading;
  window.imAccessibility = { applyFontSize: applyFontSize, applyDarkMode: applyDarkMode, readText: readText, stopReading: stopReading };
})();
