
(function(){
  const TERMS = {
    "roi":{title:"ROI",definition:"Return on investment compares gain or profit with the amount invested.",example:"A $4,000 profit on $20,000 invested is a simplified 20% ROI.",link:"roi.html"},
    "cash-flow":{title:"Cash Flow",definition:"Money remaining after income is reduced by expenses and debt payments.",example:"$2,000 income minus $1,650 costs leaves $350.",link:"cash-flow.html"},
    "noi":{title:"NOI",definition:"Net operating income is property income after normal operating expenses but before debt service and income tax.",link:"noi.html"},
    "cap-rate":{title:"Cap Rate",definition:"A ratio comparing annual NOI with property value.",link:"cap-rate.html"},
    "equity":{title:"Equity",definition:"The portion of property value not owed to lenders.",link:"equity.html"},
    "appreciation":{title:"Appreciation",definition:"An increase in property value over time.",link:"appreciation.html"},
    "depreciation":{title:"Depreciation",definition:"A tax method allocating qualifying property cost over a recovery period.",link:"depreciation.html"},
    "leverage":{title:"Leverage",definition:"Using borrowed money to control or acquire an asset.",link:"leverage.html"},
    "ltv":{title:"LTV",definition:"Loan-to-value compares loan amount with property value.",link:"ltv.html"},
    "dscr":{title:"DSCR",definition:"Debt service coverage ratio compares income available for debt payments with required debt service.",link:"dscr.html"},
    "arv":{title:"ARV",definition:"After-repair value is the estimated market value after planned improvements.",link:"arv.html"},
    "brrrr":{title:"BRRRR",definition:"Buy, rehab, rent, refinance, repeat.",link:"brrrr.html"},
    "escrow":{title:"Escrow",definition:"A neutral arrangement holding money, documents, or instructions until conditions are met.",link:"escrow.html"},
    "earnest-money":{title:"Earnest Money",definition:"A buyer deposit handled according to the purchase contract and escrow instructions.",link:"earnest-money.html"},
    "closing-costs":{title:"Closing Costs",definition:"Fees and charges paid to complete a real-estate or loan transaction.",link:"closing-costs.html"},
    "title":{title:"Property Title",definition:"The legal concept of ownership rights in property.",link:"title.html"},
    "deed":{title:"Deed",definition:"A written legal instrument used to transfer an interest in real property.",link:"deed.html"},
    "easement":{title:"Easement",definition:"A legal right to use another person's property for a limited purpose.",link:"easement.html"},
    "lien":{title:"Lien",definition:"A legal claim against property securing payment or performance.",link:"lien.html"},
    "llc":{title:"LLC",definition:"A state-created legal entity that can own property, enter contracts, and conduct business.",link:"llc.html"},
    "operating-agreement":{title:"Operating Agreement",definition:"A contract governing an LLC's ownership, management, economics, and internal rules.",link:"operating-agreement.html"},
    "section-1031":{title:"1031 Exchange",definition:"A federal tax provision that may defer gain on qualifying real-property exchanges.",link:"section-1031.html"},
    "vacancy":{title:"Vacancy",definition:"A period when a rentable unit is not producing rent.",link:"vacancy.html"},
    "reserves":{title:"Reserves",definition:"Money intentionally set aside for repairs, vacancy, emergencies, or capital work.",link:"reserves.html"},
    "contingency":{title:"Contingency",definition:"A contract condition that must be satisfied, waived, or resolved under stated terms.",link:"contingency.html"}
  };

  let modal=null,last=null;
  function ensureModal(){
    if(modal)return modal;
    modal=document.createElement("div");
    modal.className="atlas-popover";
    modal.hidden=true;
    modal.innerHTML=`
      <div class="atlas-backdrop" data-atlas-close></div>
      <section class="atlas-dialog" role="dialog" aria-modal="true" aria-labelledby="atlas-title">
        <div class="atlas-head">
          <h2 id="atlas-title">Atlas Term</h2>
          <button class="atlas-close" type="button" data-atlas-close aria-label="Close">×</button>
        </div>
        <div class="atlas-body" id="atlas-body"></div>
      </section>`;
    document.body.appendChild(modal);
    modal.addEventListener("click",e=>{
      if(e.target.closest("[data-atlas-close]"))closeModal();
    });
    document.addEventListener("keydown",e=>{
      if(e.key==="Escape"&&!modal.hidden)closeModal();
    });
    return modal;
  }
  function openTerm(key,el){
    const term=(window.ATLAS_TERMS&&window.ATLAS_TERMS[key])||TERMS[key];
    if(!term)return;
    const m=ensureModal();
    last=el;
    m.querySelector("#atlas-title").textContent=term.title||key;
    const href=term.link||`${key}.html`;
    m.querySelector("#atlas-body").innerHTML=`
      <div class="atlas-definition"><h3>Plain-English definition</h3><p>${term.definition||""}</p></div>
      ${term.example?`<div class="atlas-example"><h3>Example</h3><p>${term.example}</p></div>`:""}
      <div class="atlas-related"><a href="${href}">Open the full Atlas entry →</a></div>`;
    m.hidden=false;
    document.body.classList.add("atlas-open");
    m.querySelector(".atlas-close").focus();
  }
  function closeModal(){
    if(!modal)return;
    modal.hidden=true;
    document.body.classList.remove("atlas-open");
    if(last)last.focus();
  }
  function activate(){
    document.querySelectorAll(".atlas-term[data-term]").forEach(el=>{
      if(el.dataset.atlasReady==="1")return;
      el.dataset.atlasReady="1";
      el.tabIndex=0;
      el.setAttribute("role","button");
      const go=()=>openTerm(el.dataset.term,el);
      el.addEventListener("click",go);
      el.addEventListener("keydown",e=>{
        if(e.key==="Enter"||e.key===" "){e.preventDefault();go();}
      });
    });
  }
  document.addEventListener("DOMContentLoaded",activate);
  window.activateAtlasTerms=activate;
})();
