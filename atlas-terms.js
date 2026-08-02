
(() => {
  "use strict";

  const registry = new Map();
  let modal;
  let lastTrigger = null;

  function normalizeKey(value) {
    return String(value || "").trim().toLowerCase();
  }

  function ensureModal() {
    if (modal) return modal;

    modal = document.createElement("div");
    modal.className = "atlas-term-modal";
    modal.hidden = true;
    modal.innerHTML = `
      <div class="atlas-term-backdrop" data-atlas-close></div>
      <section class="atlas-term-dialog" role="dialog" aria-modal="true" aria-labelledby="atlas-term-title">
        <div class="atlas-term-head">
          <h2 id="atlas-term-title">Term</h2>
          <button class="atlas-term-close" type="button" aria-label="Close" data-atlas-close>×</button>
        </div>
        <div class="atlas-term-body" id="atlas-term-body"></div>
      </section>
    `;
    document.body.appendChild(modal);

    modal.addEventListener("click", (event) => {
      if (event.target.closest("[data-atlas-close]")) closeTerm();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.hidden) closeTerm();
    });

    return modal;
  }

  function renderLinks(items = []) {
    if (!Array.isArray(items) || items.length === 0) return "";
    const links = items.map(item => {
      if (typeof item === "string") {
        return `<span class="atlas-term-related">${escapeHtml(item)}</span>`;
      }
      const label = escapeHtml(item.label || item.title || "Open");
      const href = escapeAttribute(item.href || "#");
      return `<a href="${href}">${label}</a>`;
    }).join("");
    return `<div class="atlas-term-links">${links}</div>`;
  }

  function renderTerm(term) {
    const sections = [];

    if (term.definition) {
      sections.push(`<div class="atlas-term-definition"><strong>Plain-English definition</strong><p>${term.definition}</p></div>`);
    }
    if (term.formula) {
      sections.push(`<h3>Formula</h3><div class="atlas-term-formula">${term.formula}</div>`);
    }
    if (term.example) {
      sections.push(`<h3>Example</h3><div class="atlas-term-example">${term.example}</div>`);
    }
    if (term.whyItMatters) {
      sections.push(`<h3>Why it matters</h3><p>${term.whyItMatters}</p>`);
    }
    if (Array.isArray(term.mistakes) && term.mistakes.length) {
      sections.push(`<h3>Common mistakes</h3><ul>${term.mistakes.map(x => `<li>${x}</li>`).join("")}</ul>`);
    }
    if (term.atlas) {
      sections.push(`<h3>Living Atlas connection</h3><p>${term.atlas}</p>`);
    }
    if (Array.isArray(term.related) && term.related.length) {
      sections.push(`<h3>Related concepts</h3>${renderLinks(term.related)}`);
    }
    if (Array.isArray(term.resources) && term.resources.length) {
      sections.push(`<h3>Open next</h3>${renderLinks(term.resources)}`);
    }

    if (!sections.length) {
      return `<div class="atlas-term-empty">This term has not been filled in yet.</div>`;
    }
    return sections.join("");
  }

  function openTerm(key, trigger = null) {
    const term = registry.get(normalizeKey(key));
    const shell = ensureModal();
    const title = shell.querySelector("#atlas-term-title");
    const body = shell.querySelector("#atlas-term-body");

    lastTrigger = trigger || document.activeElement;
    title.textContent = term?.title || key;
    body.innerHTML = term ? renderTerm(term) : `
      <div class="atlas-term-empty">
        <strong>Term not found:</strong> ${escapeHtml(key)}
      </div>
    `;

    shell.hidden = false;
    document.body.classList.add("atlas-term-open");
    shell.querySelector(".atlas-term-close").focus();
  }

  function closeTerm() {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("atlas-term-open");
    if (lastTrigger && typeof lastTrigger.focus === "function") lastTrigger.focus();
  }

  function registerTerms(terms) {
    if (!terms || typeof terms !== "object") return;
    Object.entries(terms).forEach(([key, value]) => {
      registry.set(normalizeKey(key), { ...value });
    });
  }

  function hydrateTemplateTerms() {
    document.querySelectorAll("template[data-atlas-term]").forEach(template => {
      const key = normalizeKey(template.dataset.atlasTerm);
      if (!key) return;
      registry.set(key, {
        title: template.dataset.title || key,
        definition: template.innerHTML
      });
    });
  }

  function bindTerms(root = document) {
    root.querySelectorAll(".atlas-term[data-term]").forEach(element => {
      if (element.dataset.atlasBound === "true") return;
      element.dataset.atlasBound = "true";
      element.setAttribute("role", "button");
      element.setAttribute("tabindex", "0");

      const activate = () => openTerm(element.dataset.term, element);

      element.addEventListener("click", activate);
      element.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate();
        }
      });
    });
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[char]));
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }

  window.AtlasTerms = {
    register: registerTerms,
    bind: bindTerms,
    open: openTerm,
    close: closeTerm
  };

  document.addEventListener("DOMContentLoaded", () => {
    ensureModal();
    hydrateTemplateTerms();

    if (window.ATLAS_TERMS) registerTerms(window.ATLAS_TERMS);
    bindTerms();
  });
})();
