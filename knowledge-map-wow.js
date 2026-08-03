
(function(){
  const DATA = window.KM_WOW_DATA || {};
  const pathRoot = document.querySelector("[data-km-wow]");
  if(!pathRoot) return;

  function resourceCards(items){
    return `<div class="km-resource-grid">${items.map(item=>`
      <article class="km-resource">
        <h4><a href="${item[1]}" ${item[1].startsWith("http")?'target="_blank" rel="noopener"':''}>${item[0]}</a></h4>
        <p>${item[2]}</p>
      </article>`).join("")}</div>`;
  }

  function checklist(key,items){
    const saved = JSON.parse(localStorage.getItem("km-check-"+key) || "{}");
    return `
      <div class="km-progress-row"><span>Checklist progress</span><span data-km-count>0 / ${items.length}</span></div>
      <div class="km-progress"><span data-km-bar></span></div>
      <div class="km-checklist">${items.map((item,i)=>`
        <label class="km-check">
          <input type="checkbox" data-km-check="${i}" ${saved[i]?"checked":""}>
          <span>${item}</span>
        </label>`).join("")}</div>`;
  }

  function panelHTML(key,d){
    return `
      <div class="km-panel-top">
        <div><h3>${d.title} Mission Control</h3><p>${d.intro}</p></div>
        <a class="km-open-district" href="${d.district}">Open ${d.title} District →</a>
      </div>
      <div class="km-tabbar" role="tablist" aria-label="${d.title} tools">
        ${["learn","actions","checklist","resources","watch","atlas"].map((tab,i)=>`
          <button class="km-tab" role="tab" data-tab="${tab}" aria-selected="${i===0}">
            ${{learn:"📚 Learn",actions:"✅ Do It",checklist:"☑ Checklist",resources:"📍 Resources",watch:"▶ Watch",atlas:"🌎 Atlas"}[tab]}
          </button>`).join("")}
      </div>
      <div class="km-filter"><input type="search" placeholder="Search this path…" data-km-filter></div>
      <div class="km-tabpanel is-active" data-panel="learn">${resourceCards(d.learn)}</div>
      <div class="km-tabpanel" data-panel="actions">${resourceCards(d.actions)}</div>
      <div class="km-tabpanel" data-panel="checklist">${checklist(key,d.checklist)}</div>
      <div class="km-tabpanel" data-panel="resources">${resourceCards(d.resources)}</div>
      <div class="km-tabpanel" data-panel="watch">${resourceCards(d.watch)}</div>
      <div class="km-tabpanel" data-panel="atlas">${resourceCards(d.atlas)}</div>`;
  }

  pathRoot.querySelectorAll("[data-km-key]").forEach(button=>{
    const key = button.dataset.kmKey;
    const panel = pathRoot.querySelector(`[data-km-panel="${key}"]`);
    const data = DATA[key];
    if(!panel || !data) return;
    panel.innerHTML = panelHTML(key,data);

    button.addEventListener("click",()=>{
      const willOpen = !panel.classList.contains("is-open");
      pathRoot.querySelectorAll(".km-wow-panel.is-open").forEach(p=>p.classList.remove("is-open"));
      pathRoot.querySelectorAll(".km-step-button[aria-expanded='true']").forEach(b=>b.setAttribute("aria-expanded","false"));
      if(willOpen){
        panel.classList.add("is-open");
        button.setAttribute("aria-expanded","true");
        setTimeout(()=>panel.scrollIntoView({behavior:"smooth",block:"nearest"}),30);
        localStorage.setItem("km-last-path",key);
      }
    });

    panel.querySelectorAll(".km-tab").forEach(tab=>{
      tab.addEventListener("click",()=>{
        panel.querySelectorAll(".km-tab").forEach(t=>t.setAttribute("aria-selected","false"));
        panel.querySelectorAll(".km-tabpanel").forEach(p=>p.classList.remove("is-active"));
        tab.setAttribute("aria-selected","true");
        panel.querySelector(`[data-panel="${tab.dataset.tab}"]`).classList.add("is-active");
      });
    });

    const filter = panel.querySelector("[data-km-filter]");
    filter.addEventListener("input",()=>{
      const q = filter.value.trim().toLowerCase();
      panel.querySelectorAll(".km-resource,.km-check").forEach(card=>{
        card.style.display = card.textContent.toLowerCase().includes(q) ? "" : "none";
      });
    });

    const updateProgress=()=>{
      const checks=[...panel.querySelectorAll("[data-km-check]")];
      if(!checks.length) return;
      const done=checks.filter(c=>c.checked).length;
      const state={};
      checks.forEach(c=>state[c.dataset.kmCheck]=c.checked);
      localStorage.setItem("km-check-"+key,JSON.stringify(state));
      panel.querySelector("[data-km-count]").textContent=`${done} / ${checks.length}`;
      panel.querySelector("[data-km-bar]").style.width=`${Math.round(done/checks.length*100)}%`;
    };
    panel.querySelectorAll("[data-km-check]").forEach(c=>c.addEventListener("change",updateProgress));
    updateProgress();
  });
})();
